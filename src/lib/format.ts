const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => inr.format(value);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const discountPercent = (price: number, discountPrice?: number) =>
  discountPrice && discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;

export const effectivePrice = (price: number, discountPrice?: number) =>
  discountPrice && discountPrice < price ? discountPrice : price;

export const SHIPPING_FLAT = 99;
export const FREE_SHIPPING_THRESHOLD = 4999;

export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;