import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import type { ProductSort } from "@/types/product";

export interface ShopFilters {
  search: string;
  category: string;
  sort: ProductSort;
  min: number;
  max: number;
}

export const SORT_LABELS: Record<ProductSort, string> = {
  newest: "Newest",
  popular: "Most popular",
  rating: "Highest rated",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export const PRICE_CEILING = 6000;

function FilterFields({
  filters,
  categories,
  onChange,
  onReset,
}: {
  filters: ShopFilters;
  categories: string[];
  onChange: (patch: Partial<ShopFilters>) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="filter-search" className="text-eyebrow">
          Search
        </Label>
        <Input
          id="filter-search"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search artworks"
        />
      </div>

      <div className="space-y-3">
        <p className="text-eyebrow">Category</p>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onChange({ category })}
              aria-pressed={filters.category === category}
              className={
                filters.category === category
                  ? "rounded-sm border border-clay bg-clay/10 px-3 py-1.5 text-xs text-clay"
                  : "rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-clay hover:text-clay"
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-eyebrow">Price range</p>
        <Slider
          value={[filters.min, filters.max]}
          min={0}
          max={PRICE_CEILING}
          step={100}
          onValueChange={([min, max]) => onChange({ min: min ?? 0, max: max ?? PRICE_CEILING })}
        />
        <p className="text-xs text-muted-foreground">
          {formatPrice(filters.min)} — {formatPrice(filters.max)}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-eyebrow">Sort by</p>
        <Select value={filters.sort} onValueChange={(value) => onChange({ sort: value as ProductSort })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="ghost" size="sm" onClick={onReset} className="px-0 text-muted-foreground">
        Reset filters
      </Button>
    </div>
  );
}

export function ProductFilters(props: {
  filters: ShopFilters;
  categories: string[];
  onChange: (patch: Partial<ShopFilters>) => void;
  onReset: () => void;
}) {
  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <FilterFields {...props} />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="quiet" className="w-full">
              <SlidersHorizontal strokeWidth={1.5} /> Filter &amp; sort
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto bg-background">
            <SheetTitle className="text-eyebrow mb-6">Filter &amp; sort</SheetTitle>
            <FilterFields {...props} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}