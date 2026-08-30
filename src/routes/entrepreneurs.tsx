import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiteShell, PageHero, Section } from "@/components/site/SiteShell";
import { entrepreneursQuery, projectsQuery, type Entrepreneur } from "@/lib/queries";

export const Route = createFileRoute("/entrepreneurs")({
  head: () => ({
    meta: [
      { title: "Student Entrepreneurs | e-life Embryo" },
      {
        name: "description",
        content:
          "Meet young Embryo entrepreneurs from Kerala who turned crochet, dolls, hampers and digital skills into real products and income.",
      },
      { property: "og:title", content: "Student Entrepreneurs · e-life Embryo" },
      {
        property: "og:description",
        content: "Profiles of student founders building products and earning through Embryo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Entrepreneurs,
});

function Entrepreneurs() {
  const { data: people = [], isLoading } = useQuery(entrepreneursQuery);
  const { data: projects = [] } = useQuery(projectsQuery);
  const [active, setActive] = useState<Entrepreneur | null>(null);

  const activeProjects = projects.filter((p) => p.entrepreneur_id === active?.id);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Student Entrepreneurs"
        title="Young founders already selling what they create"
        description="These students started with one skill. Today they design, make, price and sell their own products across Kerala."
      />

      <Section>
        {isLoading ? (
          <p className="text-muted-foreground">Loading profiles…</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <article
                key={person.id}
                className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-lg font-bold text-primary-foreground">
                    {person.display_name.charAt(0)}
                  </span>
                  <div>
                    <h3 className="font-semibold leading-tight">{person.display_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {person.age ? `Age ${person.age}` : "Embryo student"}
                    </p>
                  </div>
                </div>
                <Badge className="mt-4 w-fit rounded-full bg-primary-soft text-primary">
                  {person.category || "Skill"}
                </Badge>
                <p className="mt-3 text-sm font-medium">{person.headline}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {person.bio}
                </p>
                {person.panchayat && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {person.panchayat}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 rounded-full"
                  onClick={() => setActive(person)}
                >
                  View Profile
                </Button>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.display_name}</DialogTitle>
            <DialogDescription>
              {active?.category}
              {active?.age ? ` · Age ${active.age}` : ""}
              {active?.panchayat ? ` · ${active.panchayat}` : ""}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">{active?.bio}</p>
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Products & projects
            </h4>
            <ul className="mt-3 space-y-3">
              {activeProjects.length === 0 && (
                <li className="text-sm text-muted-foreground">Projects coming soon.</li>
              )}
              {activeProjects.map((p) => (
                <li key={p.id} className="rounded-2xl bg-primary-soft/50 p-3">
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
