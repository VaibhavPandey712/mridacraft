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

/** User authentication guard */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, sessionReady } = useApp();
  const navigate = useNavigate();

  // Google has redirected back with ?token=...
  const pendingToken =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("token");

  useEffect(() => {
    if (sessionReady && !user && !pendingToken) {
      navigate({ to: "/login", replace: true });
    }
  }, [sessionReady, user, pendingToken, navigate]);

  if (pendingToken || !sessionReady) return <GuardSkeleton />;

  if (!user) return null;

  return <>{children}</>;
}

/** Admin-only guard */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, sessionReady } = useApp();
  const navigate = useNavigate();

  const pendingToken =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("token");

  useEffect(() => {
    if (sessionReady && !user && !pendingToken) {
      navigate({ to: "/login", replace: true });
    }
  }, [sessionReady, user, pendingToken, navigate]);

  if (pendingToken || !sessionReady) return <GuardSkeleton />;

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-32 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-secondary text-clay">
          <ShieldAlert className="size-5" strokeWidth={1.5} />
        </span>

        <h1 className="text-3xl">Restricted area</h1>

        <p className="text-sm text-muted-foreground">
          This section is reserved for studio administrators.
        </p>

        <Button asChild variant="clay">
          <Link to="/">Back to the shop</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}