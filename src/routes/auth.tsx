import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteShell, Section } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useRoles } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Login or Register | e-life Embryo" },
      {
        name: "description",
        content:
          "Sign in to the e-life Embryo portal to view your programs, classes and registrations.",
      },
      { property: "og:title", content: "e-life Embryo Portal Login" },
      {
        property: "og:description",
        content: "Student, parent and admin access to the Embryo program portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});

type AccountType = "student" | "parent";

function Auth() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const { isAdmin, loading } = useRoles();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [accountType, setAccountType] = useState<AccountType>("student");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (ready && user && !loading) {
      navigate({ to: isAdmin ? "/admin" : "/dashboard", replace: true });
    }
  }, [ready, user, loading, isAdmin, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, phone, account_type: accountType },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setCheckEmail(true);
          toast.success("Account created. Check your email to confirm.");
        } else {
          toast.success("Welcome to Embryo!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset(email: string) {
    if (!email) {
      toast.error("Enter your email first, then tap reset.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent.");
  }

  return (
    <SiteShell>
      <Section className="max-w-md">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
          <div className="flex gap-2 rounded-full bg-muted p-1">
            {(["login", "register"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setCheckEmail(false);
                }}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  mode === item ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            {mode === "login" ? "Sign in to Embryo" : "Create your Embryo account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Students, parents and the Embryo team use the same secure login.
          </p>

          {checkEmail ? (
            <div className="mt-6 rounded-2xl bg-primary-soft p-5 text-sm text-primary">
              Almost there — open the confirmation link we emailed you, then sign in.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              {mode === "register" && (
                <>
                  <div className="grid gap-2">
                    <Label>I am a</Label>
                    <div className="flex flex-wrap gap-2">
                      {(["student", "parent"] as const).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setAccountType(item)}
                          className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                            accountType === item
                              ? "bg-brand-gradient text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" placeholder="Your name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="+91…" />
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" size="lg" disabled={busy} className="rounded-full bg-brand-gradient">
                {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </Button>

              {mode === "login" && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline"
                  onClick={(e) => {
                    const formEl = (e.currentTarget.closest("form") as HTMLFormElement) ?? null;
                    const email = formEl
                      ? String(new FormData(formEl).get("email") ?? "").trim()
                      : "";
                    handleReset(email);
                  }}
                >
                  Forgot your password?
                </button>
              )}
            </form>
          )}
        </div>
      </Section>
    </SiteShell>
  );
}
