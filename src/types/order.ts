import type { Address } from "./user";
import type { Product } from "./product";

export const DELIVERY_STATUSES = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];
export type PaymentStatus = "Pending" | "Paid" | "Refunded" | "Failed";
export type PaymentMethod = "razorpay" | "cod";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
}

export interface CreateOrderPayload {
  items: Array<{ product: Product; quantity: number }>;
  address: Address;
  paymentMethod: PaymentMethod;
}