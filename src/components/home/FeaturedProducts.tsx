import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getFeaturedProducts } from "@/services/product.service";

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => getFeaturedProducts(4),
  });

  return (
    <section className="border-y border-border bg-card/60 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Signature pieces"
            title="Chosen by our artisans"
            description="Four pieces that best show what clay, mirror and patience can do together."
          />
          <Button asChild variant="ghost" className="px-0 text-clay hover:bg-transparent">
            <Link to="/shop" search={{ search: "", category: "All", sort: "newest", min: 0, max: 100000 }}>
              View all artworks <ArrowRight strokeWidth={1.5} />
            </Link>
          </Button>
        </div>

        <div className="mt-14">
          <ProductGrid products={data ?? []} loading={isLoading} skeletonCount={4} columns="four" />
        </div>
      </div>
    </section>
  );
}