import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell, PageHero, Section } from "@/components/site/SiteShell";
import { SITE } from "@/lib/embryo-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact e-life Embryo | Kerala" },
      {
        name: "description",
        content:
          "Contact the e-life Embryo team for student skill training, entrepreneurship programs and online classes in Kerala. Phone, email and location details.",
      },
      { property: "og:title", content: "Contact e-life Embryo" },
      {
        property: "og:description",
        content: "Reach the e-life Embryo team for programs, classes and partnerships.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const DETAILS = [
  { icon: Phone, label: "Phone", value: SITE.phone },
  { icon: Mail, label: "Email", value: SITE.email },
  { icon: Globe, label: "Website", value: SITE.website },
  { icon: MapPin, label: "Location", value: SITE.location },
];

function Contact() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to the Embryo team"
        description="Questions about a program, a class or bringing Embryo to your panchayat? We're happy to help."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-10">
            <h2 className="text-xl font-bold">e-life Embryo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              An initiative of {SITE.parent}, Kerala
            </p>
            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <d.icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {d.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium">{d.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <h3 className="mt-10 text-sm font-semibold">Follow Embryo</h3>
            <div className="mt-3 flex gap-2">
              {[Instagram, Facebook, Youtube, MessageCircle].map((Icon, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Social channels are being set up — links coming soon.
            </p>
          </div>

          <div className="rounded-[2rem] bg-brand-gradient p-8 text-primary-foreground shadow-lift md:p-10">
            <h2 className="text-2xl font-bold">Ready to start?</h2>
            <p className="mt-3 text-primary-foreground/85">
              The fastest way to reach us is to register the student. Our coordinator will call you
              within two working days.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 rounded-full">
              <Link to="/join">Join Embryo</Link>
            </Button>
            <div className="mt-10 rounded-2xl bg-primary-foreground/10 p-5 text-sm">
              <p className="font-semibold">Office hours</p>
              <p className="mt-1 text-primary-foreground/80">Monday – Saturday · 9:30 AM – 5:30 PM</p>
            </div>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
