import { delay, readStore, writeStore } from "@/lib/api";
import { shippingFor, effectivePrice } from "@/lib/format";
import type { Cart, CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

/** Endpoints later: GET/POST /api/cart, PUT/DELETE /api/cart/:id */
const key = (userId?: string) => `lippen.cart.${userId ?? "guest"}`;

function build(items: CartItem[]): Cart {
  const subtotal = items.reduce(
    (sum, item) => sum + effectivePrice(item.product.price, item.product.discountPrice) * item.quantity,
    0,
  );
  const shipping = shippingFor(subtotal);
  return { items, subtotal, shipping, total: subtotal + shipping };
}

const read = (userId?: string) => readStore<CartItem[]>(key(userId), []);
const save = (items: CartItem[], userId?: string) => writeStore(key(userId), items);

export async function getCart(userId?: string): Promise<Cart> {
  await delay(200);
  return build(read(userId));
}

export async function addToCart(product: Product, quantity = 1, userId?: string): Promise<Cart> {
  await delay(180);
  const items = read(userId);
  const existing = items.find((item) => item.product.id === product.id);
  if (existing) existing.quantity = Math.min(existing.quantity + quantity, product.stock || 99);
  else items.push({ id: product.id, product, quantity });
  save(items, userId);
  return build(items);
}

export async function updateCartItem(productId: string, quantity: number, userId?: string): Promise<Cart> {
  await delay(120);
  let items = read(userId);
  if (quantity <= 0) items = items.filter((item) => item.product.id !== productId);
  else
    items = items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );
  save(items, userId);
  return build(items);
}

export async function removeFromCart(productId: string, userId?: string): Promise<Cart> {
  return updateCartItem(productId, 0, userId);
}

export async function clearCart(userId?: string): Promise<Cart> {
  save([], userId);
  return build([]);
}

/** Merge the guest cart into the user cart after login. */
export async function mergeGuestCart(userId: string): Promise<Cart> {
  const guest = read();
  const mine = read(userId);
  guest.forEach((item) => {
    const existing = mine.find((entry) => entry.product.id === item.product.id);
    if (existing) existing.quantity += item.quantity;
    else mine.push(item);
  });
  save([], undefined);
  save(mine, userId);
  return build(mine);
}