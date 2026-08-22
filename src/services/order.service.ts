import { apiFetch, withId } from "@/lib/api";
import type { CreateOrderPayload, DeliveryStatus, Order } from "@/types/order";

interface RawOrder extends Omit<Order, "id" | "userId"> {
  _id: string;
  user: string;
}
const mapOrder = (raw: RawOrder): Order => {
  const { user, ...rest } = raw;
  return { ...(withId(rest as unknown as { _id: string } & Record<string, unknown>) as Omit<Order, "userId">), userId: user };
};

/**
 * Places a Cash on Delivery order directly.
 * For Razorpay, use `startRazorpayOrder` + `confirmRazorpayOrder` in
 * payment.service.ts instead — checkout.tsx picks the right path.
 */
export async function createOrder(
  payload: CreateOrderPayload,
  _user: { id: string; fullName: string; email: string },
): Promise<Order> {
  const { order } = await apiFetch<{ order: RawOrder }>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      items: payload.items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
      address: payload.address,
      paymentMethod: payload.paymentMethod,
    }),
  });
  return mapOrder(order);
}

export async function getOrders(_userId?: string): Promise<Order[]> {
  const raw = await apiFetch<RawOrder[]>("/api/orders");
  return raw.map(mapOrder);
}

export async function getOrderById(id: string, _userId?: string): Promise<Order | null> {
  try {
    const raw = await apiFetch<RawOrder>(`/api/orders/${id}`);
    return mapOrder(raw);
  } catch {
    return null;
  }
}

/** Admin only */
export async function getAllOrders(): Promise<Order[]> {
  const raw = await apiFetch<RawOrder[]>("/api/orders/admin/all");
  return raw.map((order) => ({
    ...order,
    id: order.id ?? order._id, // supports both formats
  }));
}

/** Admin only */
export async function updateOrderStatus(id: string, deliveryStatus: DeliveryStatus): Promise<Order> {
  const { order } = await apiFetch<{ order: RawOrder }>(`/api/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ deliveryStatus }),
  });
  return mapOrder(order);
}

/** Admin only */
export async function deleteOrderAdmin(id: string): Promise<void> {
  await apiFetch(`/api/orders/${id}`, { method: "DELETE" });
}
