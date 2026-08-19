import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Trash2 } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PriceTag } from "@/components/common/PriceTag";
import { getProducts } from "@/services/product.service";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: "My Wishlist | lippan Handcraft" },
      { name: "description", content: "Artworks you have saved from the lippan collection." },
      { property: "og:title", content: "My Wishlist | lippan" },
      { property: "og:description", content: "Saved handcrafted Lippan wall art." },
      { property: "og:url", content: "/wishlist" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
});

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const { data, isLoading } = useQuery({ queryKey: ["products", "all"], queryFn: () => getProducts() });
  const items = (data ?? []).filter((product) => wishlist.includes(product.id));

  return (
    <SiteLayout flush>
      <div className="pt-20 md:pt-24">
        <PageHeader
          eyebrow="Saved pieces"
          title="My wishlist"
          description="Keep the pieces you love in one place ,they stay here until you are ready."
        />

        <div className="mx-auto max-w-5xl px-5 py-14 lg:px-10 lg:py-20">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-sm" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Tap the heart on any artwork to keep it here for later."
              actionLabel="Explore Collection"
              actionTo="/shop"
            />
          ) : (
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((product) => (
                  <motion.li
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    className="surface-card grid grid-cols-[88px_1fr] items-center gap-5 rounded-sm p-4 sm:grid-cols-[112px_1fr_auto] sm:p-5"
                  >
                    <Link to="/product/$id" params={{ id: product.id }} className="shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        width={224}
                        height={224}
                        className="aspect-square w-full rounded-sm object-cover"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        to="/product/$id"
                        params={{ id: product.id }}
                        className="font-serif text-lg hover:text-clay"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {product.shortDescription}
                      </p>
                      <div className="mt-2">
                        <PriceTag price={product.price} discountPrice={product.discountPrice} />
                      </div>
                    </div>
                    <div className="col-span-2 flex gap-2 sm:col-span-1">
                      <Button variant="clay" size="sm" className="h-10" onClick={() => void addToCart(product)}>
                        Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${product.name} from wishlist`}
                        onClick={() => void toggleWishlist(product.id)}
                      >
                        <Trash2 strokeWidth={1.5} />
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}