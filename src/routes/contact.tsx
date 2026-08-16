import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(10, "A little more detail helps us reply well").max(1000),
});

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact the Studio | Lippen Handcraft" },
      {
        name: "description",
        content:
          "Questions about a commission, sizing or shipping? Write to the Lippen studio in Bhuj, Kutch.",
      },
      { property: "og:title", content: "Contact the Lippen Studio" },
      { property: "og:description", content: "Commissions, sizing and shipping questions." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSending(false);
    setValues({ name: "", email: "", message: "" });
    toast.success("Thank you — the studio will reply within two working days.");
  };

  return (
    <SiteLayout flush>
      <div className="pt-20 md:pt-24">
        <PageHeader
          eyebrow="Contact"
          title="Write to the studio"
          description="Commissions, custom sizes, bulk gifting or a question about care — we read everything ourselves."
        />

        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-16 lg:grid-cols-[1fr_1.2fr] lg:px-10 lg:py-24">
          <div className="space-y-8">
            {[
              { icon: MapPin, label: "Studio", value: "14 Kumbhar Wada, Bhuj, Kutch, Gujarat 370001" },
              { icon: Mail, label: "Email", value: "studio@lippen.art" },
              { icon: Phone, label: "Phone", value: "+91 98250 11223" },
            ].map((item) => (
              <div key={item.label} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-clay">
                  <item.icon className="size-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-eyebrow">{item.label}</p>
                  <p className="mt-1 text-sm">{item.value}</p>
                </div>
              </div>
            ))}
            <p className="border-t border-border pt-8 text-sm italic leading-relaxed text-muted-foreground">
              Commissions take four to six weeks. We will send you progress photographs as the clay dries.
            </p>
          </div>

          <form onSubmit={submit} noValidate className="surface-card rounded-sm p-6 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(event) => setValues({ ...values, name: event.target.value })}
                  aria-invalid={Boolean(errors["name"])}
                />
                {errors["name"] ? <p className="text-xs text-destructive">{errors["name"]}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(event) => setValues({ ...values, email: event.target.value })}
                  aria-invalid={Boolean(errors["email"])}
                />
                {errors["email"] ? <p className="text-xs text-destructive">{errors["email"]}</p> : null}
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={6}
                value={values.message}
                onChange={(event) => setValues({ ...values, message: event.target.value })}
                aria-invalid={Boolean(errors["message"])}
              />
              {errors["message"] ? <p className="text-xs text-destructive">{errors["message"]}</p> : null}
            </div>
            <Button type="submit" variant="clay" size="lg" className="mt-8 w-full sm:w-auto" disabled={sending}>
              {sending ? <Loader2 className="animate-spin" /> : "Send message"}
            </Button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}