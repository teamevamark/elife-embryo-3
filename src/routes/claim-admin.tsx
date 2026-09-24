import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteShell, Section } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { claimSuperAdmin } from "@/lib/admin.functions";
import { useAuth, useRoles } from "@/lib/auth";

export const Route = createFileRoute("/claim-admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Claim Super Admin | e-life Embryo" },
      {
        name: "description",
        content: "One-time setup step to create the first e-life Embryo super admin account.",
      },
      { property: "og:title", content: "Claim Super Admin | e-life Embryo" },
      { property: "og:description", content: "One-time super admin setup for e-life Embryo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClaimAdmin,
});

function ClaimAdmin() {
  const { user, ready } = useAuth();
  const { isSuperAdmin } = useRoles();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const claim = useServerFn(claimSuperAdmin);

  const mutation = useMutation({
    mutationFn: () => claim({ data: undefined } as any),
    onSuccess: (result: any) => {
      if (result?.ok) {
        queryClient.invalidateQueries();
        toast.success("You are now the super admin.");
        navigate({ to: "/admin" });
      } else {
        toast.error(result?.reason ?? "Could not claim super admin.");
      }
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not claim super admin."),
  });

  return (
    <SiteShell>
      <Section className="max-w-lg">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
          <h1 className="text-2xl font-bold">First-time setup</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The first signed-in account can become the super admin. After that, this page stops
            working and access is granted from the Team access screen.
          </p>
          {!ready ? (
            <p className="mt-6 text-sm text-muted-foreground">Checking your account…</p>
          ) : !user ? (
            <Button className="mt-6 rounded-full bg-brand-gradient" onClick={() => navigate({ to: "/auth" })}>
              Sign in first
            </Button>
          ) : isSuperAdmin ? (
            <Button className="mt-6 rounded-full bg-brand-gradient" onClick={() => navigate({ to: "/admin" })}>
              Open admin
            </Button>
          ) : (
            <Button
              className="mt-6 rounded-full bg-brand-gradient"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? "Setting up…" : "Make me super admin"}
            </Button>
          )}
        </div>
      </Section>
    </SiteShell>
  );
}
