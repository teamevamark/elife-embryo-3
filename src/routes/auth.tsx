import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { GraduationCap, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SiteShell, Section } from "@/components/site/SiteShell";
import { useMockAuth, type UserRole } from "@/lib/mock-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register | e-life Embryo" },
      {
        name: "description",
        content:
          "Sign in to your e-life Embryo account as a student, parent or admin to view programs, classes, projects and progress.",
      },
      { property: "og:title", content: "e-life Embryo Login" },
      {
        property: "og:description",
        content: "Student, parent and admin access to the Embryo dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});

const ROLES: { value: UserRole; label: string; icon: typeof Users; hint: string }[] = [
  { value: "student", label: "Student", icon: GraduationCap, hint: "See your programs, classes and projects." },
  { value: "parent", label: "Parent", icon: Users, hint: "Follow your child's Embryo journey." },
  { value: "admin", label: "Admin", icon: ShieldCheck, hint: "Manage students, programs and registrations." },
];

function Auth() {
  const { signIn } = useMockAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("student");
  const [mode, setMode] = useState("login");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const name = String(form.get("name") ?? "") || email.split("@")[0] || "Embryo user";
    signIn({ name, email, role });
    navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
  }

  return (
    <SiteShell>
      <Section>
        <div className="mx-auto max-w-md">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-lift md:p-9">
            <h1 className="text-2xl font-bold">Welcome to Embryo</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a demo login — no password is verified yet.
            </p>

            <div className="mt-6 grid gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                    role === r.value
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:bg-muted/60"
                  }`}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-background text-primary">
                    <r.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{r.label}</span>
                    <span className="block text-xs text-muted-foreground">{r.hint}</span>
                  </span>
                </button>
              ))}
            </div>

            <Tabs value={mode} onValueChange={setMode} className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value={mode} forceMount>
                <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
                  {mode === "register" && (
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" name="name" required placeholder="Your name" />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required placeholder="••••••••" />
                  </div>
                  <Button type="submit" className="rounded-full bg-brand-gradient shadow-soft">
                    {mode === "login" ? "Login" : "Create account"} as {role}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New to Embryo?{" "}
            <Link to="/join" className="font-medium text-primary">
              Register as a student
            </Link>
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
