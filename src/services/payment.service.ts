import { apiFetch, withId } from "@/lib/api";
import type { Address } from "@/types/user";
import type { Order } from "@/types/order";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface RawOrder extends Omit<Order, "id" | "userId"> {
  _id: string;
  user: string;
}
const mapOrder = (raw: RawOrder): Order => {
  const { user, ...rest } = raw;
  return { ...(withId(rest as unknown as { _id: string } & Record<string, unknown>) as Omit<Order, "userId">), userId: user };
};

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the Razorpay checkout script."));
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
}

/**
 * Full Razorpay flow: ask the backend to create a Razorpay order, open the
 * checkout widget, and on success confirm the payment + create the order.
 * Throws if the user cancels the payment popup.
 */
export async function payWithRazorpay(
  items: Array<{ productId: string; quantity: number }>,
  address: Address,
  user: { fullName: string; email: string; phone?: string },
): Promise<Order> {
  const created = await apiFetch<{
    requiresPayment: true;
    razorpayOrder: { id: string; amount: number; currency: string };
    key: string;
    draft: unknown;
  }>("/api/orders", {
    method: "POST",
    body: JSON.stringify({ items, address, paymentMethod: "razorpay" }),
  });

  await loadRazorpayScript();

  return new Promise<Order>((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: created.key,
      amount: created.razorpayOrder.amount,
      currency: created.razorpayOrder.currency,
      name: "MridaCraft",
      description: "Handcrafted Lippan wall art",
      order_id: created.razorpayOrder.id,
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone || "",
      },
      theme: { color: "#B5622A" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const { order } = await apiFetch<{ order: RawOrder }>("/api/orders/razorpay/confirm", {
            method: "POST",
            body: JSON.stringify({ ...response, draft: created.draft }),
          });
          resolve(mapOrder(order));
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Payment confirmation failed"));
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });
    rzp.open();
  });
}
