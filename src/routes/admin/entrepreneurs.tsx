import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/entrepreneurs")({
  head: () => ({
    meta: [
      { title: "Entrepreneurs | e-life Embryo Admin" },
      { name: "description", content: "Manage the student entrepreneur profiles on the showcase." },
      { property: "og:title", content: "Embryo Entrepreneurs Admin" },
      { property: "og:description", content: "Manage student entrepreneur profiles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="entrepreneurs"
      title="Entrepreneurs"
      description="Student entrepreneur profiles in the showcase."
      orderBy={{ column: "created_at", ascending: true }}
      columns={[
        { name: "display_name", label: "Name" },
        { name: "age", label: "Age" },
        { name: "category", label: "Category" },
        { name: "panchayat", label: "Place" },
        { name: "is_published", label: "Published" },
      ]}
      fields={[
        { name: "display_name", label: "Display name", required: true },
        { name: "age", label: "Age", type: "number" },
        { name: "category", label: "Category", placeholder: "Crochet, Baking…" },
        { name: "headline", label: "Headline" },
        { name: "bio", label: "Short description", type: "textarea" },
        { name: "panchayat", label: "Panchayat" },
        { name: "image_url", label: "Photo URL" },
        { name: "student_id", label: "Linked student", lookup: { table: "students", value: "id", label: "full_name" } },
        { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
      ]}
    />
  ),
});
