import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/SiteShell";
import { useSignOut } from "@/lib/auth";

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/registrations", label: "Registrations" },
  { to: "/admin/programs", label: "Programs" },
  { to: "/admin/classes", label: "Classes" },
  { to: "/admin/entrepreneurs", label: "Entrepreneurs" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/students", label: "Students" },
  { to: "/admin/parents", label: "Parents" },
  { to: "/admin/enrollments", label: "Enrollments" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/team", label: "Team access" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const signOut = useSignOut();

  return (
    <div className="min-h-screen bg-soft-gradient">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Logo compact />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">View site</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <nav className="flex gap-2 overflow-x-auto rounded-3xl border border-border bg-card p-2 shadow-soft lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: "exact" in link ? link.exact : false }}
              activeProps={{ className: "bg-primary-soft text-primary" }}
              className="whitespace-nowrap rounded-2xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1 rounded-3xl border border-border bg-card p-5 shadow-soft md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
