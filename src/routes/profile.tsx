import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, MapPin, Package, Settings, User2 } from "lucide-react";
import { useEffect } from "react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { RequireAuth } from "@/components/guards/RouteGuards";
import { useApp } from "@/store/app-store";

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);

    // remove token from URL
    window.history.replaceState({}, "", "/profile");
  }
}, []);


export const Route = createFileRoute("/profile")({
  component: () => (
    <RequireAuth>
      <ProfileLayout />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "My Account | Lippen Handcraft" },
      { name: "description", content: "Manage your profile, orders, addresses and saved artworks." },
      { property: "og:title", content: "My Account | Lippen" },
      { property: "og:description", content: "Your Lippen account dashboard." },
      { property: "og:url", content: "/profile" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/profile" }],
  }),
});

const LINKS = [
  { to: "/profile", label: "Profile", icon: User2, exact: true },
  { to: "/profile/orders", label: "My Orders", icon: Package, exact: false },
  { to: "/profile/addresses", label: "Addresses", icon: MapPin, exact: false },
  { to: "/wishlist", label: "Wishlist", icon: Heart, exact: false },
  { to: "/profile/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function ProfileLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[240px_1fr] lg:gap-16 lg:px-10 lg:py-16">
        <aside>
          <div className="mb-8">
            <p className="text-eyebrow">Account</p>
            <p className="mt-3 font-serif text-2xl">{user?.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
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
            <button
              type="button"
              onClick={() => {
                void logout();
                navigate({ to: "/" });
              }}
              className="flex shrink-0 items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="size-4" strokeWidth={1.5} /> Logout
            </button>
          </nav>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </SiteLayout>
  );
}