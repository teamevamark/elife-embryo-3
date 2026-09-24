import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/skills")({
  head: () => ({
    meta: [
      { title: "Skills | e-life Embryo Admin" },
      { name: "description", content: "Manage the list of Embryo skills students can learn." },
      { property: "og:title", content: "Embryo Skills Admin" },
      { property: "og:description", content: "Manage the Embryo skills list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="skills"
      title="Skills"
      description="The skill list used across programs and student profiles."
      orderBy={{ column: "name", ascending: true }}
      columns={[
        { name: "name", label: "Skill" },
        { name: "category", label: "Category" },
      ]}
      fields={[
        { name: "name", label: "Skill name", required: true },
        {
          name: "category",
          label: "Category",
          type: "select",
          defaultValue: "creative",
          options: [
            { value: "creative", label: "Creative" },
            { value: "business", label: "Business" },
            { value: "digital", label: "Digital" },
            { value: "communication", label: "Communication" },
            { value: "academic", label: "Academic" },
          ],
        },
      ]}
    />
  ),
});
