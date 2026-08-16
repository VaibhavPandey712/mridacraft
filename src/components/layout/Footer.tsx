import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All artworks", to: "/shop" },
      { label: "Collections", to: "/collections" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Our story", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "My orders", to: "/profile/orders" },
      { label: "My profile", to: "/profile" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div className="max-w-sm">
          <p className="font-serif text-2xl">Lippen</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Mud-and-mirror wall art raised by hand in Kutch, Gujarat. Every piece leaves the studio
            signed by the artisan who made it.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
            <a className="flex items-center gap-2 hover:text-clay" href="mailto:studio@lippen.art">
              <Mail className="size-4" strokeWidth={1.5} /> studio@lippen.art
            </a>
            <a className="flex items-center gap-2 hover:text-clay" href="tel:+919825011223">
              <Phone className="size-4" strokeWidth={1.5} /> +91 98250 11223
            </a>
            <a className="flex items-center gap-2 hover:text-clay" href="https://instagram.com">
              <Instagram className="size-4" strokeWidth={1.5} /> @lippen.studio
            </a>
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-eyebrow">{column.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted-foreground transition-colors hover:text-clay">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} Lippen Handcraft Studio. Made by hand in India.</p>
          <p className="italic">Each piece is individually crafted — no two are ever identical.</p>
        </div>
      </div>
    </footer>
  );
}