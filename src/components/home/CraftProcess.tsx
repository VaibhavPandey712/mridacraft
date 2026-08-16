import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

const STEPS = [
  {
    step: "01",
    title: "Clay is mixed",
    copy: "Local terracotta is kneaded with binder until it holds a raised line without cracking.",
  },
  {
    step: "02",
    title: "Motifs are drawn",
    copy: "The artisan free-hands the design — peacocks, vines, mandalas — directly onto the base.",
  },
  {
    step: "03",
    title: "Mirrors are set",
    copy: "Hand-cut glass is pressed in by eye, one piece at a time, while the clay is still soft.",
  },
  {
    step: "04",
    title: "Cured & signed",
    copy: "Nine to fourteen days of slow drying, a protective finish, and the maker’s signature.",
  },
];

export function CraftProcess() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
      <SectionHeading
        eyebrow="How it is made"
        title="Four hands, fourteen days, one artwork"
        description="Nothing here is moulded or printed. The process is slow on purpose."
        align="center"
      />
      <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((item, index) => (
          <Reveal key={item.step} delay={index * 0.08}>
            <div className="h-full bg-background p-8">
              <p className="font-serif text-3xl text-clay/70">{item.step}</p>
              <h3 className="mt-6 text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}