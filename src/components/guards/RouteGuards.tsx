import { useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/store/app-store";

function GuardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-5 py-24 lg:px-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

/** UX-level protection only — the backend remains the source of authorisation truth. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, sessionReady } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionReady && !user) navigate({ to: "/login", replace: true });
  }, [sessionReady, user, navigate]);

  if (!sessionReady || !user) return <GuardSkeleton />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, sessionReady } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionReady && !user) navigate({ to: "/login", replace: true });
  }, [sessionReady, user, navigate]);

  if (!sessionReady || !user) return <GuardSkeleton />;

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-32 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-secondary text-clay">
          <ShieldAlert className="size-5" strokeWidth={1.5} />
        </span>
        <h1 className="text-3xl">Restricted area</h1>
        <p className="text-sm text-muted-foreground">
          This section is reserved for studio administrators. Your account doesn’t have access.
        </p>
        <Button asChild variant="clay">
          <Link to="/">Back to the shop</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}