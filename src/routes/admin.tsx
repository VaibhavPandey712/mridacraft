import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { RequireAdmin } from "@/components/guards/RouteGuards";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  ),
  head: () => ({
    meta: [
      { title: "Studio Admin | Lippen" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { to: "/admin/customers", label: "Customers", icon: Users, exact: false },
] as const;

function AdminLayout() {
  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[220px_1fr] lg:gap-12 lg:px-10 lg:py-16">
        <aside>
          <p className="text-eyebrow mb-6">Studio admin</p>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.exact }}
                activeProps={{ className: "bg-secondary text-clay" }}
                className="flex shrink-0 items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-clay"
              >
                <link.icon className="size-4" strokeWidth={1.5} /> {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </SiteLayout>
  );
}
