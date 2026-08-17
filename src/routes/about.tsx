import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/common/Reveal";
import { CraftProcess } from "@/components/home/CraftProcess";
import { StoryQuote } from "@/components/home/StoryQuote";
import artisan from "@/assets/artisan-hands.jpeg";
import hero from "@/assets/hero-lippan.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Our Story — Lippan Artisans | Lippan" },
      {
        name: "description",
        content:
          "Lippan Studio by MridaCraft creates handcrafted Lippan art pieces that blend traditional craftsmanship with modern home décor. Each design is carefully made to add elegance, texture, and a unique artistic touch to living spaces.",
      },
      { property: "og:title", content: "Our Story — Lippan Artisans of Kutch" },
      { property: "og:description", content: "Four generations of mud-and-mirror craft." },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function AboutPage() {
  return (
    <SiteLayout flush>
      <div className="pt-20 md:pt-24">
        <PageHeader
          eyebrow="Our story"
          title="lorem ipsum "
          description="Lippan Studio by MridaCraft creates handcrafted Lippan art pieces that blend traditional craftsmanship with modern home décor. Each design is carefully made to add elegance, texture, and a unique artistic touch to living spaces."
        />

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <img
                src={hero}
                alt="Large Lippan wall art panel in a warm minimal interior"
                loading="lazy"
                width={1600}
                height={1200}
                className="rounded-sm object-cover"
              />
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl">Tradition, without the museum glass</h2>
              <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                <p>
                  Lippan Studio by MridaCraft creates handcrafted Lippan art pieces that blend traditional craftsmanship with modern home décor. Each design is carefully made to add elegance, texture, and a unique artistic touch to living spaces.
                </p>
                <p>
                  We keep the technique exactly as it was taught, and change only the format: sealed
                  bases, concealed hooks and sizes that suit an apartment wall.
                </p>
                <p>
                  Nothing is cast from a mould. If you look closely at two pieces of the same design,
                  you will find the difference — and that is the point.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-border bg-card/60">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1fr_1.1fr] lg:px-10">
            <Reveal>
              <img
                src={artisan}
                alt="Artisan "
                loading="lazy"
                width={1200}
                height={1408}
                className="rounded-sm object-cover"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-eyebrow">Our promise</p>
              <ul className="mt-8 space-y-8">
                {[
                  {
                    title: "Fair, per-piece pay",
                    copy: "Artisans set the price of their labour. We do not run reverse auctions.",
                  },
                  
                  {
                    title: "Repair, not replace",
                    copy: "Chipped a mirror? Send it back and we will restore it in the studio.",
                  },
                ].map((item) => (
                  <li key={item.title} className="border-l border-clay/40 pl-6">
                    <h3 className="text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <CraftProcess />
        <StoryQuote />
      </div>
    </SiteLayout>
  );
}