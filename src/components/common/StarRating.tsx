import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  rating = 0,
  reviewCount,
  size = "sm",
}: {
  rating?: number | undefined;
  reviewCount?: number | undefined;
  size?: "sm" | "md" | undefined;
}) {
  const dimension = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div className="flex items-center gap-2" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((step) => (
          <Star
            key={step}
            className={cn(dimension, step <= Math.round(rating) ? "fill-gold text-gold" : "text-border")}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {reviewCount !== undefined ? (
        <span className="text-xs text-muted-foreground">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      ) : null}
    </div>
  );
}