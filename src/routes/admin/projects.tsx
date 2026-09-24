import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({
    meta: [
      { title: "Projects | e-life Embryo Admin" },
      { name: "description", content: "Manage student products and projects shown on profiles." },
      { property: "og:title", content: "Embryo Projects Admin" },
      { property: "og:description", content: "Manage student products and projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="projects"
      title="Projects"
      description="Products and projects linked to student entrepreneurs."
      orderBy={{ column: "created_at", ascending: true }}
      columns={[
        { name: "title", label: "Title" },
        { name: "description", label: "Description" },
        { name: "is_published", label: "Published" },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image_url", label: "Image URL" },
        {
          name: "entrepreneur_id",
          label: "Entrepreneur",
          lookup: { table: "entrepreneurs", value: "id", label: "display_name" },
        },
        { name: "student_id", label: "Student", lookup: { table: "students", value: "id", label: "full_name" } },
        { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
      ]}
    />
  ),
});
