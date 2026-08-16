import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

import authArt from "@/assets/auth-art.jpg";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-charcoal lg:block">
        <motion.img
          src={authArt}
          alt="Traditional Lippan folk art motifs in clay and mirror"
          width={1008}
          height={1408}
          className="absolute inset-0 size-full object-cover"
          initial={{ scale: 1.08 }}
          animate={reduced ? {} : { scale: 1.18 }}
          transition={{ duration: 24, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/20" />

        {[
          { size: 8, top: "22%", left: "18%", delay: 0 },
          { size: 5, top: "48%", left: "72%", delay: 1.4 },
          { size: 11, top: "68%", left: "34%", delay: 0.7 },
          { size: 6, top: "80%", left: "62%", delay: 2.1 },
        ].map((particle) => (
          <motion.span
            key={particle.left}
            aria-hidden
            className="absolute rounded-full bg-gold/70"
            style={{ width: particle.size, height: particle.size, top: particle.top, left: particle.left }}
            animate={reduced ? {} : { y: [0, -26, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="font-serif text-xl text-secondary">
            Lippen
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Kutch handcraft</p>
            <p className="mt-5 max-w-sm font-serif text-3xl leading-snug text-secondary">
              Every mirror in this panel was set by hand, one at a time.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 block font-serif text-xl lg:hidden">
            Lippen
          </Link>
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-sm border border-border text-sm transition-colors hover:border-clay hover:text-clay disabled:opacity-50"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path
          fill="currentColor"
          d="M12 11v2.4h5.7c-.2 1.5-1.7 4.4-5.7 4.4A6.3 6.3 0 1 1 16.2 7l1.9-1.8A9 9 0 1 0 21 12c0-.4 0-.7-.1-1H12Z"
        />
      </svg>
      Continue with Google
    </button>
  );
}