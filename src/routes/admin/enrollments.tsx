import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/enrollments")({
  head: () => ({
    meta: [
      { title: "Enrollments | e-life Embryo Admin" },
      { name: "description", content: "See which student is enrolled in which Embryo program." },
      { property: "og:title", content: "Embryo Enrollments Admin" },
      { property: "og:description", content: "Manage student program enrollments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="enrollments"
      title="Enrollments"
      description="Links between students and the programs they joined."
      select="id,status,enrolled_at,students(full_name),programs(name)"
      orderBy={{ column: "enrolled_at", ascending: false }}
      columns={[
        { name: "student", label: "Student", render: (row) => row.students?.full_name ?? "—" },
        { name: "program", label: "Program", render: (row) => row.programs?.name ?? "—" },
        { name: "status", label: "Status" },
        {
          name: "enrolled_at",
          label: "Enrolled",
          render: (row) => new Date(row.enrolled_at).toLocaleDateString("en-IN"),
        },
      ]}
      fields={[
        {
          name: "student_id",
          label: "Student",
          required: true,
          lookup: { table: "students", value: "id", label: "full_name" },
        },
        {
          name: "program_id",
          label: "Program",
          required: true,
          lookup: { table: "programs", value: "id", label: "name" },
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          defaultValue: "active",
          options: [
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
            { value: "paused", label: "Paused" },
          ],
        },
      ]}
    />
  ),
});
