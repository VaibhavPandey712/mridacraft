import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import artisan from "@/assets/artisan-hands.jpeg";

export function BrandStory() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <p className="text-eyebrow">The craft</p>
          <h2 className="mt-5 text-3xl leading-[1.08] sm:text-4xl lg:text-[2.9rem]">
            Made by hand.
            <br />
            <em className="font-normal italic text-clay">Inspired by tradition.</em>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-8 sm:max-w-md">
            {[
              { value: "5 yrs", label: "of studio practice" },
              { value: "2", label: "artisans" },
              { value: "9-14 days", label: "to finish one panel" },
              { value: "100%", label: "hand-raised clay work" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-serif text-2xl text-clay">{stat.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
          <Button asChild variant="quiet" className="mt-10">
            <Link to="/about">Read our story</Link>
          </Button>
        </Reveal>

        <Reveal delay={0.15} className="order-1 lg:order-2">
          <div className="relative">
            <img
              src={artisan}
              alt="Artisan shaping clay relief on a Lippan wall art disc"
              loading="lazy"
              width={1200}
              height={1408}
              className="w-full rounded-sm object-cover"
            />
            <div className="absolute -bottom-6 -left-6 hidden max-w-[220px] surface-card rounded-sm p-5 sm:block">
              <p className="font-serif text-lg">Crafted by hand</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Each piece is individually crafted, making every artwork unique.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}