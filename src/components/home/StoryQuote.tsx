import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";

export function StoryQuote() {
  return (
    <section className="border-t border-border bg-charcoal">
      <div className="mx-auto max-w-4xl px-5 py-24 text-center lg:py-32">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Why it matters</p>
          <blockquote className="mt-8 text-balance font-serif text-3xl leading-[1.2] text-secondary sm:text-4xl lg:text-[2.75rem]">
            “You’re not just buying wall decoration. You’re buying handcrafted culture and art.”
          </blockquote>
          <p className="mt-8 text-sm text-secondary/70">
            Garima Pandey · Founder, Mridacraft
          </p>
          <Button asChild variant="gold" className="mt-10 text-secondary">
            <Link to="/collections">Browse the collections</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}