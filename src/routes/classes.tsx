import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, User, Video } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteShell, PageHero, Section } from "@/components/site/SiteShell";
import { classesQuery } from "@/lib/queries";
import { ageGroupLabel, formatClassDate, formatClassTime } from "@/lib/embryo-data";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "Online Classes | e-life Embryo" },
      {
        name: "description",
        content:
          "Upcoming Embryo online classes for students aged 5–22 — crochet, doll making, abacus, public speaking, digital and entrepreneurship sessions with live trainers.",
      },
      { property: "og:title", content: "Upcoming Online Classes · e-life Embryo" },
      {
        property: "og:description",
        content: "Live skill and entrepreneurship classes for Junior and Young Embryo students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Classes,
});

function Classes() {
  const { data: classes = [], isLoading } = useQuery(classesQuery);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Online Classes"
        title="Live sessions with real practitioners"
        description="Join weekly Embryo classes from home. Every session is hands-on, with a project you finish by the end."
      />

      <Section>
        {isLoading ? (
          <p className="text-muted-foreground">Loading the timetable…</p>
        ) : classes.length === 0 ? (
          <p className="text-muted-foreground">No classes scheduled right now — check back soon.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {classes.map((cls) => (
              <article
                key={cls.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{cls.title}</h3>
                  <Badge
                    className={`shrink-0 rounded-full ${
                      cls.mode === "online" ? "bg-leaf-soft text-leaf" : "bg-accent-soft text-accent"
                    }`}
                  >
                    {cls.mode === "online" ? "Online" : "Offline"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {ageGroupLabel(cls.age_group)}
                </p>
                <dl className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> {cls.trainer_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {formatClassDate(cls.starts_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {formatClassTime(cls.starts_at)} · {cls.duration_minutes} min
                  </div>
                </dl>
                <Button
                  className="mt-6 w-full rounded-full bg-brand-gradient shadow-soft"
                  onClick={() =>
                    toast.info("Class links open 15 minutes before start", {
                      description: "Registered students get the link by SMS and on their dashboard.",
                    })
                  }
                >
                  <Video className="mr-1 h-4 w-4" /> Join Class
                </Button>
              </article>
            ))}
          </div>
        )}
      </Section>
    </SiteShell>
  );
}
