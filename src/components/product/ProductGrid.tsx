import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-square w-full rounded-sm" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function ProductGrid({
  products,
  loading,
  skeletonCount = 6,
  columns = "three",
}: {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  columns?: "three" | "four";
}) {
  const grid =
    columns === "four"
      ? "grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
      : "grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3";

  if (loading) {
    return (
      <div className={grid}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={grid}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}