import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { BrandStory } from "@/components/home/BrandStory";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CraftProcess } from "@/components/home/CraftProcess";
import { StoryQuote } from "@/components/home/StoryQuote";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lippan — Handcrafted Lippan Wall Art for Modern Homes" },
      {
        name: "description",
        content:
          "Authentic Lippan mud-and-mirror wall art, hand-raised in Kutch. Mandalas, folk panels and tile sets for modern Indian homes.",
      },
      { property: "og:title", content: "Lippan — Handcrafted Lippan Wall Art" },
      {
        property: "og:description",
        content: "Made with tradition. Designed for modern homes. Handcrafted Lippan wall art.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  return (
    <SiteLayout flush>
      <Hero />
      <BrandStory />
      <FeaturedProducts />
      <CraftProcess />
      <StoryQuote />
    </SiteLayout>
  );
}
