import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/common/PriceTag";
import { StarRating } from "@/components/common/StarRating";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [pending, setPending] = useState<"cart" | "buy" | null>(null);
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product.id);

  const handleAdd = async (mode: "cart" | "buy") => {
    setPending(mode);
    try {
      await addToCart(product);
      if (mode === "buy") navigate({ to: "/checkout" });
    } finally {
      setPending(null);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3) }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden rounded-sm bg-secondary/60">
        <Link to="/product/$id" params={{ id: product.id }} aria-label={product.name}>
          <img
            src={product.images[0]}
            alt={`${product.name} — handcrafted Lippan wall art`}
            loading="lazy"
            width={1008}
            height={1008}
            className="aspect-square w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        </Link>

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => void toggleWishlist(product.id)}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-border/60 bg-background/80 backdrop-blur transition-colors hover:border-clay"
        >
          <Heart
            className={cn("size-4 transition-colors", wishlisted ? "fill-clay text-clay" : "text-foreground")}
            strokeWidth={1.5}
          />
        </motion.button>

        {product.stock <= 5 ? (
          <span className="absolute left-3 top-3 rounded-sm bg-background/85 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-clay backdrop-blur">
            Only {product.stock} left
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <Link to="/product/$id" params={{ id: product.id }} className="font-serif text-xl hover:text-clay">
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-3">
          <PriceTag price={product.price} discountPrice={product.discountPrice} />
        </div>
        <div className="mt-2">
          <StarRating rating={product.rating ?? 0} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="quiet"
            size="sm"
            className="h-10"
            disabled={pending !== null}
            onClick={() => void handleAdd("cart")}
          >
            {pending === "cart" ? <Loader2 className="animate-spin" /> : "Add to Cart"}
          </Button>
          <Button
            variant="clay"
            size="sm"
            className="h-10"
            disabled={pending !== null}
            onClick={() => void handleAdd("buy")}
          >
            {pending === "buy" ? <Loader2 className="animate-spin" /> : "Buy Now"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}