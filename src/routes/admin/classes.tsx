import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/classes")({
  head: () => ({
    meta: [
      { title: "Classes | e-life Embryo Admin" },
      { name: "description", content: "Schedule and edit Embryo online and offline classes." },
      { property: "og:title", content: "Embryo Classes Admin" },
      { property: "og:description", content: "Schedule and edit Embryo classes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="classes"
      title="Classes"
      description="Upcoming sessions listed on the classes page."
      orderBy={{ column: "starts_at", ascending: true }}
      columns={[
        { name: "title", label: "Class" },
        { name: "trainer_name", label: "Trainer" },
        {
          name: "starts_at",
          label: "Starts",
          render: (row) => new Date(row.starts_at).toLocaleString("en-IN"),
        },
        { name: "age_group", label: "Group" },
        { name: "mode", label: "Mode" },
      ]}
      fields={[
        { name: "title", label: "Class title", required: true },
        { name: "trainer_name", label: "Trainer" },
        { name: "starts_at", label: "Starts at", type: "datetime", required: true },
        { name: "duration_minutes", label: "Duration (minutes)", type: "number", defaultValue: 60 },
        {
          name: "age_group",
          label: "Age group",
          type: "select",
          defaultValue: "junior",
          options: [
            { value: "junior", label: "Junior (5-15)" },
            { value: "young", label: "Young (16-22)" },
            { value: "both", label: "Both" },
          ],
        },
        {
          name: "mode",
          label: "Mode",
          type: "select",
          defaultValue: "online",
          options: [
            { value: "online", label: "Online" },
            { value: "offline", label: "Offline" },
          ],
        },
        { name: "join_url", label: "Join link" },
        { name: "program_id", label: "Program", lookup: { table: "programs", value: "id", label: "name" } },
      ]}
    />
  ),
});
