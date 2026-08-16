import { Reveal } from "@/components/common/Reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
        <Reveal>
          {eyebrow ? <p className="text-eyebrow mb-4">{eyebrow}</p> : null}
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
          {description ? (
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </Reveal>
      </div>
    </div>
  );
}