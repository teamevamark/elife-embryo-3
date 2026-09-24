import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/programs")({
  head: () => ({
    meta: [
      { title: "Programs | e-life Embryo Admin" },
      { name: "description", content: "Create and edit Embryo skill and entrepreneurship programs." },
      { property: "og:title", content: "Embryo Programs Admin" },
      { property: "og:description", content: "Create and edit Embryo programs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="programs"
      title="Programs"
      description="Programs shown on the website."
      orderBy={{ column: "sort_order", ascending: true }}
      columns={[
        { name: "name", label: "Name" },
        { name: "age_group", label: "Group" },
        { name: "mode", label: "Mode" },
        { name: "sort_order", label: "Order" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Program name", required: true },
        { name: "slug", label: "Slug", required: true, placeholder: "crochet-work" },
        { name: "description", label: "Description", type: "textarea" },
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
            { value: "hybrid", label: "Hybrid" },
          ],
        },
        { name: "image_url", label: "Image URL" },
        { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
        { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
      ]}
    />
  ),
});
