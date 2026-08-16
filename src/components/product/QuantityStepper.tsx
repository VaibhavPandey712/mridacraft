import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  max = 99,
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-sm border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-clay disabled:opacity-40"
      >
        <Minus className="size-4" strokeWidth={1.5} />
      </button>
      <span className="w-10 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-clay disabled:opacity-40"
      >
        <Plus className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}