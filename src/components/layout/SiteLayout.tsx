import type { ReactNode } from "react";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children, flush = false }: { children: ReactNode; flush?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={flush ? "flex-1" : "flex-1 pt-24 md:pt-28"}>{children}</main>
      <Footer />
    </div>
  );
}