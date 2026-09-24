import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview | e-life Embryo" },
      {
        name: "description",
        content: "Super admin overview of Embryo registrations, programs, classes and students.",
      },
      { property: "og:title", content: "e-life Embryo Admin Overview" },
      { property: "og:description", content: "Manage the Embryo program from one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminOverview,
});

type Reg = {
  id: string;
  student_name: string;
  phone: string;
  age_group: string;
  panchayat: string | null;
  status: string;
  created_at: string;
};

const countsQuery = queryOptions({
  queryKey: ["admin", "counts"],
  queryFn: async () => {
    const tables = ["registrations", "students", "programs", "classes", "entrepreneurs"] as const;
    const results = await Promise.all(
      tables.map(async (t) => {
        const { count, error } = await supabase
          .from(t as any)
          .select("id", { count: "exact", head: true });
        if (error) throw error;
        return [t, count ?? 0] as const;
      }),
    );
    return Object.fromEntries(results) as Record<(typeof tables)[number], number>;
  },
});

const recentQuery = queryOptions({
  queryKey: ["admin", "recent-registrations"],
  queryFn: async (): Promise<Reg[]> => {
    const { data, error } = await supabase
      .from("registrations")
      .select("id,student_name,phone,age_group,panchayat,status,created_at")
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw error;
    return (data ?? []) as Reg[];
  },
});

function AdminOverview() {
  const { data: counts } = useQuery(countsQuery);
  const { data: recent = [] } = useQuery(recentQuery);

  const cards = [
    { label: "Registrations", value: counts?.registrations ?? 0, to: "/admin/registrations" },
    { label: "Students", value: counts?.students ?? 0, to: "/admin/students" },
    { label: "Programs", value: counts?.programs ?? 0, to: "/admin/programs" },
    { label: "Classes", value: counts?.classes ?? 0, to: "/admin/classes" },
    { label: "Entrepreneurs", value: counts?.entrepreneurs ?? 0, to: "/admin/entrepreneurs" },
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything happening across Embryo right now.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-3xl border border-border bg-background p-5 transition-colors hover:border-primary/40"
          >
            <p className="text-3xl font-bold text-primary">{c.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold">Latest registrations</h2>
      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No registrations yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Group</th>
                <th className="px-4 py-3">Place</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{row.student_name}</td>
                  <td className="px-4 py-3">{row.phone}</td>
                  <td className="px-4 py-3 capitalize">{row.age_group}</td>
                  <td className="px-4 py-3">{row.panchayat ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
