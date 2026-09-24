import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/CrudSection";

export const Route = createFileRoute("/admin/parents")({
  head: () => ({
    meta: [
      { title: "Parents | e-life Embryo Admin" },
      { name: "description", content: "View and manage parent and guardian records." },
      { property: "og:title", content: "Embryo Parents Admin" },
      { property: "og:description", content: "View and manage parent and guardian records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CrudSection
      table="parents"
      title="Parents"
      description="Parents and guardians linked to students."
      orderBy={{ column: "created_at", ascending: false }}
      columns={[
        { name: "full_name", label: "Name" },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email" },
        { name: "panchayat", label: "Place" },
      ]}
      fields={[
        { name: "full_name", label: "Full name", required: true },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email" },
        { name: "panchayat", label: "Panchayat" },
      ]}
    />
  ),
});
