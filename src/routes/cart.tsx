import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Trash2 } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { formatPrice, effectivePrice, FREE_SHIPPING_THRESHOLD } from "@/lib/format";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Your Cart | Lippan Handcraft" },
      { name: "description", content: "Review the handcrafted artworks in your cart before checkout." },
      { property: "og:title", content: "Your Cart | Lippan" },
      { property: "og:description", content: "Review your handcrafted selections." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
});

function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useApp();

  return (
    <SiteLayout flush>
      <div className="pt-20 md:pt-24">
        <PageHeader eyebrow="Cart" title="Your selections" />

        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
          {cart.items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty."
              description="Discover something beautiful for your walls."
              actionLabel="Explore Collection"
              actionTo="/shop"
            />
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {cart.items.map((item) => (
                    <motion.li
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      className="surface-card grid grid-cols-[88px_1fr] gap-5 rounded-sm p-4 sm:grid-cols-[120px_1fr] sm:p-5"
                    >
                      <Link to="/product/$id" params={{ id: item.product.id }}>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          loading="lazy"
                          width={240}
                          height={240}
                          className="aspect-square w-full rounded-sm object-cover"
                        />
                      </Link>
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <Link
                              to="/product/$id"
                              params={{ id: item.product.id }}
                              className="font-serif text-lg hover:text-clay"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-xs text-muted-foreground">{item.product.category}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void removeFromCart(item.product.id)}
                            aria-label={`Remove ${item.product.name}`}
                            className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                          <QuantityStepper
                            value={item.quantity}
                            max={Math.max(1, item.product.stock)}
                            onChange={(next) => void updateQuantity(item.product.id, next)}
                          />
                          <p className="text-base font-medium">
                            {formatPrice(
                              effectivePrice(item.product.price, item.product.discountPrice) * item.quantity,
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <aside className="lg:sticky lg:top-28 lg:h-fit">
                <div className="surface-card rounded-sm p-6 sm:p-8">
                  <h2 className="text-eyebrow">Order summary</h2>
                  <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd>{formatPrice(cart.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Shipping</dt>
                      <dd>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
                    </div>
                    <div className="hairline-divider my-4" />
                    <div className="flex items-baseline justify-between">
                      <dt className="font-serif text-lg">Total</dt>
                      <dd className="font-serif text-2xl">{formatPrice(cart.total)}</dd>
                    </div>
                  </dl>
                  {cart.subtotal < FREE_SHIPPING_THRESHOLD ? (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - cart.subtotal)} more for free shipping.
                    </p>
                  ) : null}
                  <Button asChild variant="clay" size="lg" className="mt-8 w-full">
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <p className="mt-4 text-center text-xs italic text-muted-foreground">
                    Each piece is individually crafted — yours will be uniquely its own.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}