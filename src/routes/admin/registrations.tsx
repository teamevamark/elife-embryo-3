import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/registrations")({
  head: () => ({
    meta: [
      { title: "Registrations | e-life Embryo Admin" },
      { name: "description", content: "Review and update Embryo registration requests." },
      { property: "og:title", content: "Embryo Registrations" },
      { property: "og:description", content: "Review and update Embryo registration requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="registrations"
      title="Registrations"
      description="Every join request from the website."
      orderBy={{ column: "created_at", ascending: false }}
      columns={[
        { name: "student_name", label: "Student" },
        { name: "phone", label: "Phone" },
        { name: "age_group", label: "Group" },
        { name: "panchayat", label: "Place" },
        { name: "interested_skills", label: "Skills" },
        { name: "status", label: "Status" },
      ]}
      fields={[
        { name: "student_name", label: "Student name", required: true },
        { name: "date_of_birth", label: "Date of birth", type: "date" },
        { name: "parent_name", label: "Parent / guardian" },
        { name: "phone", label: "Phone", required: true },
        { name: "email", label: "Email" },
        { name: "panchayat", label: "Panchayat" },
        { name: "institution", label: "School / college" },
        {
          name: "age_group",
          label: "Age group",
          type: "select",
          defaultValue: "junior",
          options: [
            { value: "junior", label: "Junior (5-15)" },
            { value: "young", label: "Young (16-22)" },
          ],
        },
        { name: "interested_skills", label: "Interested skills" },
        { name: "program_id", label: "Program", lookup: { table: "programs", value: "id", label: "name" } },
        { name: "program_interest", label: "Program interest (free text)" },
        {
          name: "status",
          label: "Status",
          type: "select",
          defaultValue: "new",
          options: [
            { value: "new", label: "New" },
            { value: "contacted", label: "Contacted" },
            { value: "enrolled", label: "Enrolled" },
            { value: "rejected", label: "Not proceeding" },
          ],
        },
      ]}
    />
  ),
});
