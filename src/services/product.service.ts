import { apiFetch, withId } from "@/lib/api";
import type { Product, ProductInput, ProductQuery } from "@/types/product";

interface RawProduct extends Omit<Product, "id"> {
  _id: string;
}

const mapProduct = (raw: RawProduct): Product => withId(raw) as Product;

function toQueryString(query: ProductQuery) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (typeof query.minPrice === "number") params.set("minPrice", String(query.minPrice));
  if (typeof query.maxPrice === "number") params.set("maxPrice", String(query.maxPrice));
  if (query.sort) params.set("sort", query.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const raw = await apiFetch<RawProduct[]>(`/api/products${toQueryString(query)}`);
  return raw.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const raw = await apiFetch<RawProduct>(`/api/products/${id}`);
    return mapProduct(raw);
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const raw = await apiFetch<RawProduct[]>(`/api/products/featured?limit=${limit}`);
  return raw.map(mapProduct);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const raw = await apiFetch<RawProduct[]>(`/api/products/${product.id}/related?limit=${limit}`);
  return raw.map(mapProduct);
}

export async function getCategories(): Promise<string[]> {
  return apiFetch<string[]>("/api/products/categories");
}

/**
 * Admin-only. `input.images` may either be already-hosted URLs (strings) or
 * omitted if you pass real Files via `imageFiles` — the browser file picker
 * in the admin dashboard uses the latter.
 */
export async function createProduct(
  input: Omit<ProductInput, "images"> & { images?: string[] },
  imageFiles?: File[],
): Promise<Product> {
  const form = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "images") return;
    form.append(key, String(value));
  });
  if (imageFiles?.length) {
    imageFiles.forEach((file) => form.append("images", file));
  } else if (input.images?.length) {
    form.append("images", input.images.join(","));
  }

  const { product } = await apiFetch<{ product: RawProduct }>("/api/products", {
    method: "POST",
    headers: {}, // let the browser set the multipart boundary
    body: form,
  });
  return mapProduct(product);
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<ProductInput, "images">> & { images?: string[] },
  imageFiles?: File[],
): Promise<Product> {
  const form = new FormData();
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "images") return;
    form.append(key, String(value));
  });
  if (imageFiles?.length) {
    imageFiles.forEach((file) => form.append("images", file));
  } else if (patch.images?.length) {
    form.append("images", patch.images.join(","));
  }

  const { product } = await apiFetch<{ product: RawProduct }>(`/api/products/${id}`, {
    method: "PUT",
    headers: {},
    body: form,
  });
  return mapProduct(product);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch(`/api/products/${id}`, { method: "DELETE" });
}
