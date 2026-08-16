import { Check } from "lucide-react";

import { DELIVERY_STATUSES, type DeliveryStatus } from "@/types/order";
import { cn } from "@/lib/utils";

export function OrderTimeline({ status }: { status: DeliveryStatus }) {
  const current = DELIVERY_STATUSES.indexOf(status);

  return (
    <ol className="grid gap-4 sm:grid-cols-5">
      {DELIVERY_STATUSES.map((label, index) => {
        const done = index <= current;
        return (
          <li key={label} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border text-[10px]",
                done ? "border-clay bg-clay text-clay-foreground" : "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3" strokeWidth={2.5} /> : index + 1}
            </span>
            <span
              className={cn(
                "text-xs",
                index === current ? "text-clay" : done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}