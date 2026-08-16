import { discountPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  discountPrice,
  className,
  size = "md",
}: {
  price: number;
  discountPrice?: number | undefined;
  className?: string | undefined;
  size?: "md" | "lg" | undefined;
}) {
  const off = discountPercent(price, discountPrice);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-medium tracking-tight", size === "lg" ? "text-2xl" : "text-base")}>
        {formatPrice(discountPrice && off ? discountPrice : price)}
      </span>
      {off ? (
        <>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(price)}</span>
          <span className="text-xs uppercase tracking-widest text-clay">{off}% off</span>
        </>
      ) : null}
    </div>
  );
}