import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/lib/auth";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Team Access | e-life Embryo Admin" },
      { name: "description", content: "Grant or remove admin access for Embryo team accounts." },
      { property: "og:title", content: "Embryo Team Access" },
      { property: "og:description", content: "Grant or remove admin access for team accounts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamAccess,
});

type Member = {
  id: string;
  full_name: string;
  phone: string | null;
  account_type: string;
  roles: string[];
};

function TeamAccess() {
  const queryClient = useQueryClient();
  const { isSuperAdmin } = useRoles();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin", "team"],
    queryFn: async (): Promise<Member[]> => {
      const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
        supabase.from("profiles").select("id,full_name,phone,account_type"),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      if (pErr) throw pErr;
      if (rErr) throw rErr;
      return (profiles ?? []).map((p) => ({
        ...p,
        roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as string),
      }));
    },
  });

  const grant = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "super_admin" }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      toast.success("Access granted.");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not grant access."),
  });

  const revoke = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "super_admin" }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      toast.success("Access removed.");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not remove access."),
  });

  return (
    <section>
      <h1 className="text-2xl font-bold">Team access</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isSuperAdmin
          ? "Grant or remove admin access for any account."
          : "Only a super admin can change access."}
      </p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const isAdmin = m.roles.includes("admin");
                const isSuper = m.roles.includes("super_admin");
                return (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{m.full_name || "Unnamed account"}</td>
                    <td className="px-4 py-3 capitalize">{m.account_type}</td>
                    <td className="px-4 py-3">
                      {isSuper ? "Super admin" : isAdmin ? "Admin" : "Member"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {isAdmin ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!isSuperAdmin}
                            onClick={() => revoke.mutate({ userId: m.id, role: "admin" })}
                          >
                            Remove admin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!isSuperAdmin || isSuper}
                            onClick={() => grant.mutate({ userId: m.id, role: "admin" })}
                          >
                            Make admin
                          </Button>
                        )}
                        {isSuper ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!isSuperAdmin}
                            onClick={() => revoke.mutate({ userId: m.id, role: "super_admin" })}
                          >
                            Remove super admin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!isSuperAdmin}
                            onClick={() => grant.mutate({ userId: m.id, role: "super_admin" })}
                          >
                            Make super admin
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
