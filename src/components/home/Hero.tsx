import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MoveDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-lippan.jpg";

export function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 90]);
  const textY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -40]);

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-secondary/40">
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <img
          src={heroImage}
          alt="Handcrafted Lippan mud and mirror wall art panel on a plaster wall"
          width={1600}
          height={1200}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
      </motion.div>

      {/* floating decorative clay dots */}
      {[
        { size: 180, top: "18%", left: "62%", delay: 0 },
        { size: 90, top: "62%", left: "78%", delay: 0.6 },
        { size: 42, top: "34%", left: "48%", delay: 1.1 },
      ].map((dot) => (
        <motion.span
          key={dot.left}
          aria-hidden
          className="pointer-events-none absolute hidden rounded-full border border-gold/40 lg:block"
          style={{ width: dot.size, height: dot.size, top: dot.top, left: dot.left }}
          animate={reduced ? {} : { y: [0, -18, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        style={{ y: textY }}
        className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-24 pt-32 lg:px-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-eyebrow"
        >
          Kutch · Since 1998
        </motion.p>

        <h1 className="mt-6 max-w-3xl text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl">
          {["Handcrafted Stories", "For Your Walls"].map((line, index) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {index === 1 ? <em className="font-normal italic text-clay">{line}</em> : line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          Authentic Lippan wall art — made with tradition, designed for modern homes. Raised in clay,
          set with mirrors, finished entirely by hand.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-10"
        >
          <Button asChild size="lg" variant="clay">
            <Link to="/shop" search={{ search: "", category: "All", sort: "newest", min: 0, max: 100000 }}>
              Explore Collection <ArrowRight strokeWidth={1.5} />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground lg:left-10"
        >
          <motion.span
            animate={reduced ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="grid size-8 place-items-center rounded-full border border-border"
          >
            <MoveDown className="size-3.5" strokeWidth={1.5} />
          </motion.span>
          Scroll to explore
        </motion.div>
      </motion.div>
    </section>
  );
}