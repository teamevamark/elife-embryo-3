import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, CalendarDays, Rocket, ClipboardList, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteShell, Section } from "@/components/site/SiteShell";
import { useMockAuth } from "@/lib/mock-auth";
import { classesQuery, entrepreneursQuery, programsQuery } from "@/lib/queries";
import { ageGroupLabel, formatClassDate, formatClassTime } from "@/lib/embryo-data";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | e-life Embryo" },
      {
        name: "description",
        content:
          "Embryo admin console — overview of students, programs, classes, entrepreneurs and recent registrations.",
      },
      { property: "og:title", content: "Embryo Admin Dashboard" },
      { property: "og:description", content: "Manage Embryo students, programs and classes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "students", label: "Students", icon: Users },
  { key: "programs", label: "Programs", icon: BookOpen },
  { key: "classes", label: "Classes", icon: CalendarDays },
  { key: "entrepreneurs", label: "Entrepreneurs", icon: Rocket },
  { key: "registrations", label: "Registrations", icon: ClipboardList },
] as const;

const DEMO_STUDENTS = [
  { name: "Aiswarya R", ageGroup: "junior", panchayat: "Chelakkara", program: "Crochet Work" },
  { name: "Muhammed Sinan", ageGroup: "young", panchayat: "Tirurangadi", program: "Digital Skills" },
  { name: "Devananda P", ageGroup: "junior", panchayat: "Kottayam", program: "Abacus" },
  { name: "Fathima Nihala", ageGroup: "young", panchayat: "Perinthalmanna", program: "Young Entrepreneurship" },
];

const DEMO_REGISTRATIONS = [
  { name: "Anagha S", phone: "+91 98•• ••1204", program: "Doll Making", status: "new" },
  { name: "Rithwik Menon", phone: "+91 90•• ••7781", program: "Public Speaking", status: "contacted" },
  { name: "Hiba Rahman", phone: "+91 85•• ••3390", program: "Hamper Making", status: "new" },
];

function Admin() {
  const { user, ready } = useMockAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof NAV)[number]["key"]>("dashboard");
  const { data: programs = [] } = useQuery(programsQuery);
  const { data: classes = [] } = useQuery(classesQuery);
  const { data: entrepreneurs = [] } = useQuery(entrepreneursQuery);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth" });
  }, [ready, user, navigate]);

  if (!ready || !user) return null;

  const stats = [
    { label: "Total Students", value: DEMO_STUDENTS.length, icon: Users },
    { label: "Active Programs", value: programs.length, icon: BookOpen },
    { label: "Upcoming Classes", value: classes.length, icon: CalendarDays },
    { label: "Student Entrepreneurs", value: entrepreneurs.length, icon: Rocket },
  ];

  return (
    <SiteShell>
      <Section>
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            Admin console
          </span>
          <h1 className="mt-3 text-3xl font-bold">Embryo administration</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === item.key
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0">
            {tab === "dashboard" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-3xl font-bold">{s.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:col-span-2">
                  <h2 className="text-lg font-semibold">Recent registrations</h2>
                  <ul className="mt-4 divide-y divide-border">
                    {DEMO_REGISTRATIONS.map((r) => (
                      <li key={r.name} className="flex items-center justify-between gap-3 py-3">
                        <div>
                          <p className="text-sm font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.program} · {r.phone}
                          </p>
                        </div>
                        <Badge className="rounded-full bg-leaf-soft text-leaf">{r.status}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === "students" && (
              <AdminList
                title="Students"
                rows={DEMO_STUDENTS.map((s) => ({
                  key: s.name,
                  primary: s.name,
                  secondary: `${ageGroupLabel(s.ageGroup)} · ${s.panchayat}`,
                  badge: s.program,
                }))}
              />
            )}

            {tab === "programs" && (
              <AdminList
                title="Programs"
                rows={programs.map((p) => ({
                  key: p.id,
                  primary: p.name,
                  secondary: p.description,
                  badge: p.mode === "online" ? "Online" : "Offline",
                }))}
              />
            )}

            {tab === "classes" && (
              <AdminList
                title="Classes"
                rows={classes.map((c) => ({
                  key: c.id,
                  primary: c.title,
                  secondary: `${c.trainer_name} · ${formatClassDate(c.starts_at)} ${formatClassTime(c.starts_at)}`,
                  badge: ageGroupLabel(c.age_group),
                }))}
              />
            )}

            {tab === "entrepreneurs" && (
              <AdminList
                title="Entrepreneurs"
                rows={entrepreneurs.map((e) => ({
                  key: e.id,
                  primary: e.display_name,
                  secondary: e.headline,
                  badge: e.category,
                }))}
              />
            )}

            {tab === "registrations" && (
              <AdminList
                title="Registrations"
                rows={DEMO_REGISTRATIONS.map((r) => ({
                  key: r.name,
                  primary: r.name,
                  secondary: `${r.program} · ${r.phone}`,
                  badge: r.status,
                }))}
              />
            )}
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}

function AdminList({
  title,
  rows,
}: {
  title: string;
  rows: { key: string; primary: string; secondary: string; badge: string }[];
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 divide-y divide-border">
        {rows.length === 0 && <li className="py-3 text-sm text-muted-foreground">Nothing yet.</li>}
        {rows.map((row) => (
          <li key={row.key} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">{row.primary}</p>
              <p className="truncate text-xs text-muted-foreground">{row.secondary}</p>
            </div>
            <Badge variant="secondary" className="shrink-0 rounded-full">
              {row.badge}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
