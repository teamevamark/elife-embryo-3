import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteShell, PageHero, Section } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { programsQuery } from "@/lib/queries";
import { PANCHAYAT_PLACEHOLDER, SKILL_OPTIONS } from "@/lib/embryo-data";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join Embryo | Student Registration" },
      {
        name: "description",
        content:
          "Register for e-life Embryo. Students aged 5–22 in Kerala can sign up for skill training, entrepreneurship programs and online classes.",
      },
      { property: "og:title", content: "Join e-life Embryo" },
      {
        property: "og:description",
        content: "Free registration for Junior Embryo (5–15) and Young Embryo (16–22) programs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Join,
});

function Join() {
  const { data: programs = [] } = useQuery(programsQuery);
  const [ageGroup, setAgeGroup] = useState("junior");
  const [programId, setProgramId] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const selected = programs.find((p) => p.id === programId);

    const { error: insertError } = await supabase.from("registrations").insert({
      student_name: String(form.get("student_name") ?? ""),
      date_of_birth: (form.get("date_of_birth") as string) || null,
      parent_name: (form.get("parent_name") as string) || null,
      phone: String(form.get("phone") ?? ""),
      email: (form.get("email") as string) || null,
      panchayat: (form.get("panchayat") as string) || null,
      institution: (form.get("institution") as string) || null,
      age_group: ageGroup,
      interested_skills: skills.join(", "),
      program_id: programId || null,
      program_interest: selected?.name ?? null,
    });

    setSubmitting(false);
    if (insertError) {
      setError("We couldn't save your registration. Please check your details and try again.");
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <SiteShell>
        <Section>
          <div className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card p-10 text-center shadow-lift">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-leaf-soft text-leaf">
              <PartyPopper className="h-8 w-8" />
            </span>
            <h1 className="mt-6 text-2xl font-bold">Welcome to Embryo!</h1>
            <p className="mt-3 text-muted-foreground">
              Your registration is in. Our team will call you within 2 working days to guide you to
              the right program for your age and interest.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full bg-brand-gradient">
                <Link to="/programs">Explore programs</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/classes">See upcoming classes</Link>
              </Button>
            </div>
          </div>
        </Section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Join Embryo"
        title="Register in two minutes"
        description="Tell us about the student and what they are curious about. Registration is free."
      />

      <Section>
        <form
          onSubmit={handleSubmit}
          className="mx-auto grid max-w-3xl gap-6 rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-10"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="student_name">Student name *</Label>
              <Input id="student_name" name="student_name" required placeholder="Full name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date_of_birth">Date of birth</Label>
              <Input id="date_of_birth" name="date_of_birth" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent_name">Parent / guardian name</Label>
              <Input id="parent_name" name="parent_name" placeholder="Parent or guardian" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number *</Label>
              <Input id="phone" name="phone" required inputMode="tel" placeholder="+91 …" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="panchayat">Panchayat</Label>
              <Input id="panchayat" name="panchayat" placeholder={PANCHAYAT_PLACEHOLDER} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="institution">School / College</Label>
              <Input id="institution" name="institution" placeholder="Institution name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age_group">Age group *</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger id="age_group">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior Embryo · 5–15</SelectItem>
                  <SelectItem value="young">Young Embryo · 16–22</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="program">Program interested in</Label>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger id="program">
                <SelectValue placeholder="Choose a program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium">Interested skills</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {SKILL_OPTIONS.map((skill) => (
                <label key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={skills.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </fieldset>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="rounded-full bg-brand-gradient shadow-soft"
          >
            <CheckCircle2 className="mr-1 h-4 w-4" />
            {submitting ? "Submitting…" : "Submit registration"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By registering you agree to be contacted by the e-life Embryo team.
          </p>
        </form>
      </Section>
    </SiteShell>
  );
}
