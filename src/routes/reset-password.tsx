import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell, Section } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset Password | e-life Embryo" },
      { name: "description", content: "Choose a new password for your e-life Embryo account." },
      { property: "og:title", content: "Reset your Embryo password" },
      { property: "og:description", content: "Choose a new password for your Embryo account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    if (password.length < 6) {
      toast.error("Use at least 6 characters.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated.");
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <SiteShell>
      <Section className="max-w-md">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-3xl border border-border bg-card p-7 shadow-soft"
        >
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <Button type="submit" disabled={busy} className="rounded-full bg-brand-gradient">
            {busy ? "Saving…" : "Update password"}
          </Button>
        </form>
      </Section>
    </SiteShell>
  );
}
