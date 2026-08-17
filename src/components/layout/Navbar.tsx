import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, LogOut, Menu, Search, ShoppingBag, User2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-clay text-[10px] font-medium text-clay-foreground"
    >
      {count}
    </motion.span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { cartCount, wishlist, user, isAdmin, logout } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/shop", search: { search: term, category: "All", sort: "newest", min: 0, max: 6000 } });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 transition-all duration-500 lg:px-10",
          scrolled ? "h-16" : "h-20 md:h-24",
        )}
      >
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Lippan home">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-gold/70 font-serif text-base text-clay">
            L
          </span>
          <span className="min-w-0">
            <span className="block truncate font-serif text-lg leading-none tracking-tight">Lippan</span>
            <span className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              Handcraft Studio
            </span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "text-clay" }}
              activeOptions={{ exact: link.to === "/" }}
              className="group relative text-[0.8125rem] uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:text-clay"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-clay transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-0.5">
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Search artworks">
                <Search strokeWidth={1.5} />
              </Button>
            </DialogTrigger>
            <DialogContent className="top-24 max-w-xl translate-y-0 border-border bg-card">
              <DialogTitle className="text-eyebrow">Search the studio</DialogTitle>
              <form onSubmit={submitSearch} className="flex gap-2">
                <Input
                  autoFocus
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Try “mandala”, “peacock”, “tile set”…"
                  className="h-11"
                />
                <Button type="submit" variant="clay" className="h-11">
                  Search
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Wishlist">
            <Link to="/wishlist">
              <Heart strokeWidth={1.5} />
              <CountBadge count={wishlist.length} />
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Cart">
            <Link to="/cart">
              <ShoppingBag strokeWidth={1.5} />
              <CountBadge count={cartCount} />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User2 strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <span className="block font-serif text-base">{user.fullName}</span>
                    <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">My profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/orders">My orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/addresses">Addresses</Link>
                  </DropdownMenuItem>
                  {isAdmin ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      void logout();
                      navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="mr-2 size-4" strokeWidth={1.5} /> Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                    Welcome to the studio
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login">Log in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Create account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                {mobileOpen ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82vw] max-w-sm bg-background">
              <SheetTitle className="text-eyebrow">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="block border-b border-border py-4 font-serif text-2xl"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-2">
                {user ? (
                  <Button asChild variant="quiet" onClick={() => setMobileOpen(false)}>
                    <Link to="/profile">My account</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="clay" onClick={() => setMobileOpen(false)}>
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button asChild variant="quiet" onClick={() => setMobileOpen(false)}>
                      <Link to="/register">Create account</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}