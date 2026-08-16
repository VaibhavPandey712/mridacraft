import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/common/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/services/product.service";

const BLURBS: Record<string, string> = {
  Mandala: "Circular geometry, drawn from the centre outward — our calmest pieces.",
  "Folk Story": "Peacocks, caravans and village scenes, told the way Kutch walls tell them.",
  "Tile Sets": "Small formats made to be clustered across a wall in loose arrangements.",
  "Statement Panels": "Large-format artworks built to anchor an entire room.",
  "Mirror Work": "Pieces where hand-cut glass leads and the clay simply frames it.",
};

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
  head: () => ({
    meta: [
      { title: "Collections — Mandalas, Folk Panels & Tile Sets | Lippen" },
      {
        name: "description",
        content:
          "Explore Lippen collections: mandalas, folk story panels, mirror work, tile sets and large statement pieces.",
      },
      { property: "og:title", content: "Lippen Collections" },
      { property: "og:description", content: "Five ways into handcrafted Lippan wall art." },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
});

function CollectionsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["products", "all"], queryFn: () => getProducts() });

  const groups = Object.entries(
    (data ?? []).reduce<Record<string, typeof data>>((acc, product) => {
      acc[product.category] = [...(acc[product.category] ?? []), product];
      return acc;
    }, {}),
  );

  return (
    <SiteLayout flush>
      <div className="pt-20 md:pt-24">
        <PageHeader
          eyebrow="Collections"
          title="Five ways into the craft"
          description="Each collection follows a different tradition of Lippan work — pick the one that suits your wall."
        />

        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map(([category, products], index) => (
                <Reveal key={category} delay={index * 0.07}>
                  <Link
                    to="/shop"
                    search={{ search: "", category, sort: "newest", min: 0, max: 6000 }}
                    className="group block overflow-hidden rounded-sm border border-border bg-card"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={products?.[0]?.images[0]}
                        alt={`${category} collection`}
                        loading="lazy"
                        width={1008}
                        height={1008}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-2xl">{category}</h2>
                        <ArrowUpRight
                          className="size-4 shrink-0 text-clay transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {BLURBS[category] ?? "Handcrafted Lippan pieces."}
                      </p>
                      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {products?.length} {products?.length === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}