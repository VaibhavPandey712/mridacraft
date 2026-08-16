import { apiFetch, withId } from "@/lib/api";

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
}

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/api/admin/stats");
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  addresses: unknown[];
}

export async function getAllCustomers(): Promise<AdminUser[]> {
  const raw = await apiFetch<Array<Omit<AdminUser, "id"> & { _id: string }>>("/api/admin/users");
  return raw.map((u) => withId(u) as AdminUser);
}

export { getAllOrders, updateOrderStatus, deleteOrderAdmin } from "./order.service";
export { createProduct, updateProduct, deleteProduct, getProducts } from "./product.service";
