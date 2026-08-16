import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      {Icon ? (
        <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary">
          <Icon className="size-5" strokeWidth={1.5} />
        </span>
      ) : null}
      <h3 className="text-2xl">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {actionLabel && actionTo ? (
        <Button asChild variant="clay" className="mt-2">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}