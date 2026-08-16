export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  material?: string;
  dimensions?: string;
  weight?: string;
  technique?: string;
  care?: string;
  featured?: boolean;
  createdAt: string;
}

export type ProductSort = "newest" | "popular" | "rating" | "price-asc" | "price-desc";

export interface ProductQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}

export type ProductInput = Omit<Product, "id" | "slug" | "createdAt" | "rating" | "reviewCount">;