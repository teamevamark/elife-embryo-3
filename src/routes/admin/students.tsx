import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/students")({
  head: () => ({
    meta: [
      { title: "Students | e-life Embryo Admin" },
      { name: "description", content: "View and manage Embryo student records." },
      { property: "og:title", content: "Embryo Students Admin" },
      { property: "og:description", content: "View and manage Embryo student records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="students"
      title="Students"
      description="Students enrolled in the Embryo programs."
      orderBy={{ column: "created_at", ascending: false }}
      columns={[
        { name: "full_name", label: "Name" },
        { name: "age_group", label: "Group" },
        { name: "phone", label: "Phone" },
        { name: "panchayat", label: "Place" },
        { name: "institution", label: "School / college" },
      ]}
      fields={[
        { name: "full_name", label: "Full name", required: true },
        { name: "date_of_birth", label: "Date of birth", type: "date" },
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
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email" },
        { name: "panchayat", label: "Panchayat" },
        { name: "institution", label: "School / college" },
        { name: "parent_id", label: "Parent", lookup: { table: "parents", value: "id", label: "full_name" } },
      ]}
    />
  ),
});
