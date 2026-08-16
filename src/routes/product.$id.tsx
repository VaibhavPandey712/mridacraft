import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2, PackageX, ShieldCheck, Truck } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/common/EmptyState";
import { PriceTag } from "@/components/common/PriceTag";
import { StarRating } from "@/components/common/StarRating";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { getProductById, getRelatedProducts } from "@/services/product.service";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => ({ product: await getProductById(params.id) }),
  component: ProductPage,
  head: ({ loaderData, params }) => {
    const product = loaderData?.product;
    const title = product ? `${product.name} — Handcrafted Lippan Wall Art | Lippen` : "Artwork | Lippen";
    const description = product
      ? `${product.shortDescription}. ${product.description.slice(0, 110)}…`
      : "Handcrafted Lippan wall art from Kutch.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.id}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.id}` }],
      scripts: product
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.shortDescription,
                material: product.material,
                offers: {
                  "@type": "Offer",
                  priceCurrency: "INR",
                  price: product.discountPrice ?? product.price,
                  availability:
                    product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                },
              }),
            },
          ]
        : [],
    };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState<"cart" | "buy" | null>(null);

  const { data: related } = useQuery({
    queryKey: ["products", "related", product?.id],
    queryFn: () => (product ? getRelatedProducts(product, 4) : Promise.resolve([])),
    enabled: Boolean(product),
  });

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-20 lg:px-10">
          <EmptyState
            icon={PackageX}
            title="This artwork isn’t available"
            description="It may have found a home already. Browse the rest of the collection instead."
            actionLabel="Explore collection"
            actionTo="/shop"
          />
        </div>
      </SiteLayout>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAdd = async (mode: "cart" | "buy") => {
    setPending(mode);
    try {
      await addToCart(product, quantity);
    } finally {
      setPending(null);
    }
  };

  const specs = [
    { label: "Material", value: product.material },
    { label: "Dimensions", value: product.dimensions },
    { label: "Weight", value: product.weight },
    { label: "Crafting technique", value: product.technique },
    { label: "Care instructions", value: product.care },
  ].filter((spec) => Boolean(spec.value));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-16">
        <nav className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-clay">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/shop"
            search={{ search: "", category: "All", sort: "newest", min: 0, max: 100000 }}
            className="hover:text-clay"
          >
            Shop
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <p className="text-eyebrow">{product.category}</p>
            <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            </div>

            <div className="mt-6">
              <PriceTag price={product.price} discountPrice={product.discountPrice} size="lg" />
              <p className="mt-2 text-xs text-muted-foreground">
                Inclusive of taxes · {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>

            <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stock)} />
              <button
                type="button"
                onClick={() => void toggleWishlist(product.id)}
                className="inline-flex h-10 items-center gap-2 rounded-sm border border-border px-4 text-sm transition-colors hover:border-clay hover:text-clay"
                aria-pressed={wishlisted}
              >
                <Heart className={cn("size-4", wishlisted && "fill-clay text-clay")} strokeWidth={1.5} />
                {wishlisted ? "Saved" : "Wishlist"}
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                variant="quiet"
                size="lg"
                disabled={pending !== null || product.stock === 0}
                onClick={() => void handleAdd("cart")}
              >
                {pending === "cart" ? <Loader2 className="animate-spin" /> : "Add to Cart"}
              </Button>
              <Button
                asChild={pending === null && product.stock > 0}
                variant="clay"
                size="lg"
                disabled={pending !== null || product.stock === 0}
                onClick={() => void handleAdd("buy")}
              >
                {pending === null && product.stock > 0 ? <Link to="/checkout">Buy Now</Link> : <span>Buy Now</span>}
              </Button>
            </div>

            <div className="mt-8 grid gap-4 rounded-sm bg-secondary/60 p-5 text-xs text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <Truck className="size-4 text-clay" strokeWidth={1.5} /> Insured shipping across India
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-clay" strokeWidth={1.5} /> Free studio repair for a year
              </p>
            </div>

            <Separator className="my-10" />

            <h2 className="text-eyebrow">Product information</h2>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              {specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[130px_1fr] gap-4 py-4 text-sm">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="min-w-0">{spec.value}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[130px_1fr] gap-4 py-4 text-sm">
                <dt className="text-muted-foreground">Handmade</dt>
                <dd>Yes — raised by hand, signed by the maker. Slight variation is expected.</dd>
              </div>
            </dl>
          </div>
        </div>

        <section className="mt-24">
          <SectionHeading eyebrow="You may also like" title="From the same hands" />
          <div className="mt-10">
            <ProductGrid products={related ?? []} loading={!related} skeletonCount={4} columns="four" />
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}