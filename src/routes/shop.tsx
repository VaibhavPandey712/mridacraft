import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  PRICE_CEILING,
  ProductFilters,
  SORT_LABELS,
  type ShopFilters,
} from "@/components/product/ProductFilters";
import { getCategories, getProducts } from "@/services/product.service";
import type { ProductSort } from "@/types/product";

const DEFAULTS: ShopFilters = {
  search: "",
  category: "All",
  sort: "newest",
  min: 0,
  max: PRICE_CEILING,
};

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  validateSearch: (raw: Record<string, unknown>): ShopFilters => ({
    search: typeof raw["search"] === "string" ? raw["search"] : DEFAULTS.search,
    category: typeof raw["category"] === "string" ? raw["category"] : DEFAULTS.category,
    sort:
      typeof raw["sort"] === "string" && raw["sort"] in SORT_LABELS
        ? (raw["sort"] as ProductSort)
        : DEFAULTS.sort,
    min: Number(raw["min"] ?? DEFAULTS.min) || 0,
    max: Number(raw["max"] ?? DEFAULTS.max) || PRICE_CEILING,
  }),
  head: () => ({
    meta: [
      { title: "Shop Handcrafted Lippan Wall Art | lippan" },
      {
        name: "description",
        content:
          "Browse handcrafted Lippan mandalas, folk panels, mirror work and tile sets. Filter by category, price and rating.",
      },
      { property: "og:title", content: "Shop Handcrafted Lippan Wall Art" },
      { property: "og:description", content: "Mud-and-mirror wall art, hand-raised in Kutch." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
});

function ShopPage() {
  const searchParams = Route.useSearch();
  const [filters, setFilters] = useState<ShopFilters>(searchParams);

  useEffect(() => {
    setFilters(searchParams);
  }, [searchParams]);

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () =>
      getProducts({
        search: filters.search,
        category: filters.category,
        sort: filters.sort,
        minPrice: filters.min,
        maxPrice: filters.max,
      }),
  });

  const update = (patch: Partial<ShopFilters>) => setFilters((current) => ({ ...current, ...patch }));

  return (
    <SiteLayout flush>
      <div className="pt-20 md:pt-24">
        <PageHeader
          eyebrow="The collection"
          title="Every piece, hand-raised"
          description="Artworks in clay and mirror — from small tile sets to statement panels for a focal wall."
        />

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[260px_1fr] lg:gap-16 lg:px-10 lg:py-16">
          <ProductFilters
            filters={filters}
            categories={categories ?? []}
            onChange={update}
            onReset={() => setFilters(DEFAULTS)}
          />

          <div>
            <p className="mb-8 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {isLoading ? "Loading artworks…" : `${products?.length ?? 0} artworks`}
            </p>

            {!isLoading && (products?.length ?? 0) === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="Nothing matches that yet"
                description="Try widening the price range or clearing the search to see the full collection."
                actionLabel="Reset filters"
                actionTo="/shop"
              />
            ) : (
              <ProductGrid products={products ?? []} loading={isLoading} skeletonCount={6} />
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}