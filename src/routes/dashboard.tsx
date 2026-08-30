import { useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  Sparkles,
  FolderKanban,
  Award,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell, Section } from "@/components/site/SiteShell";
import { JourneyStrip } from "@/components/site/JourneyStrip";
import { useMockAuth } from "@/lib/mock-auth";
import { classesQuery, programsQuery } from "@/lib/queries";
import { formatClassDate, formatClassTime } from "@/lib/embryo-data";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Student Dashboard | e-life Embryo" },
      {
        name: "description",
        content:
          "Your Embryo dashboard — programs, upcoming classes, skills, projects, certificates and achievements in one place.",
      },
      { property: "og:title", content: "Embryo Student Dashboard" },
      { property: "og:description", content: "Track your Embryo learning journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const JOURNEY_STEPS = [
  { step: "Discover", detail: "You found your skill interest." },
  { step: "Learn", detail: "Attending weekly guided classes." },
  { step: "Practice", detail: "Finishing weekly practice projects." },
  { step: "Create", detail: "Building your first sellable product." },
  { step: "Earn", detail: "Selling at expos and online." },
];

function Dashboard() {
  const { user, ready } = useMockAuth();
  const navigate = useNavigate();
  const { data: programs = [] } = useQuery(programsQuery);
  const { data: classes = [] } = useQuery(classesQuery);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth" });
  }, [ready, user, navigate]);

  if (!ready || !user) return null;

  const myPrograms = programs.slice(0, 3);
  const upcoming = classes.slice(0, 3);

  const CARDS = [
    { icon: BookOpen, label: "My Programs", value: myPrograms.length },
    { icon: CalendarDays, label: "Upcoming Classes", value: upcoming.length },
    { icon: Sparkles, label: "Skills", value: 4 },
    { icon: FolderKanban, label: "Projects", value: 2 },
    { icon: Award, label: "Certificates", value: 1 },
    { icon: Trophy, label: "Achievements", value: 3 },
  ];

  return (
    <SiteShell>
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {user.role === "parent" ? "Parent view" : "Student dashboard"}
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">Hi {user.name} 👋</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Here's your Embryo progress so far. Keep going — the next milestone is your first sale.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.label}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-3xl font-bold">{c.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Your next classes">
        <div className="grid gap-4 md:grid-cols-3">
          {upcoming.map((cls) => (
            <div key={cls.id} className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <p className="font-semibold">{cls.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{cls.trainer_name}</p>
              <p className="mt-3 text-sm text-primary">
                {formatClassDate(cls.starts_at)} · {formatClassTime(cls.starts_at)}
              </p>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6 rounded-full">
          <Link to="/classes">View full timetable</Link>
        </Button>
      </Section>

      <div className="bg-soft-gradient">
        <Section title="Your Embryo journey" subtitle="Discover → Learn → Practice → Create → Earn">
          <JourneyStrip steps={JOURNEY_STEPS} />
        </Section>
      </div>
    </SiteShell>
  );
}
