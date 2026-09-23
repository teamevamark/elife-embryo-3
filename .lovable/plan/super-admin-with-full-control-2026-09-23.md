# Super Admin with Full Control

Replace the current demo login with real, secure accounts and give a super admin complete control over every part of the Embryo site.

## What you get

**Real sign in**
- Email and password accounts, with sign up, sign in and sign out.
- The current "pick your role" demo login goes away. Nobody can reach the admin area just by choosing "Admin".
- Roles are stored safely on the server, so they can't be faked from the browser.

**Super admin area**
A single admin section with a sidebar and one management screen per area:
- Registrations — see every form submission, change status (new, contacted, enrolled), delete spam.
- Programs — add, edit, reorder, show/hide, delete.
- Classes — add, edit, delete upcoming classes, including trainer, date, time, age group and join link.
- Entrepreneurs — add, edit, publish/unpublish, delete student entrepreneur profiles.
- Projects — add, edit, publish/unpublish, delete, linked to an entrepreneur.
- Students and parents — view, edit, delete records.
- Skills — add, edit, delete the skill list.
- Enrollments — see which student is in which program, add or remove.
- Team access — grant or remove admin access for other accounts.

**Overview screen**
Live counts of registrations, students, programs, classes and entrepreneurs, plus the newest registrations.

**Student and parent side**
Signed-in students and parents keep their dashboard, but it now runs on their real account instead of the demo one.

## First super admin

I need one email address to make the first super admin. Tell me the address and I will:
1. Have you sign up with it on the new sign-up screen.
2. Promote that account to super admin.

After that, the super admin can grant admin access to anyone else from the Team access screen.

Note: email/password sign-in must be switched on in your own Supabase project's Auth settings, since this backend is connected by you rather than managed here. I will point out exactly where if it isn't already on.

## Technical details

- New `app_role` enum (`super_admin`, `admin`, `user`) and a separate `user_roles` table. Roles are never stored on a profile row. A `has_role(uuid, app_role)` security-definer function backs every policy, avoiding recursive RLS.
- New `profiles` table keyed to `auth.users(id)` with `on delete cascade`, auto-created by a signup trigger, holding display name, phone and account type (student/parent).
- Each new table gets explicit `GRANT`s for `authenticated`/`service_role` before RLS is enabled.
- Every existing table (`programs`, `classes`, `entrepreneurs`, `projects`, `skills`, `students`, `parents`, `enrollments`, `student_skills`, `registrations`) gains admin `INSERT`/`UPDATE`/`DELETE` policies plus an admin `SELECT` policy where reads are currently blocked (notably `registrations`). Existing public read policies stay untouched.
- `src/lib/mock-auth.tsx` is removed and replaced with a Supabase-backed `useAuth` hook: `onAuthStateChange` listener registered first, `getUser()` for trusted checks, plus a `useIsAdmin` query reading `user_roles`.
- Admin routes move under `src/routes/admin/` with a layout route that renders `<Outlet />` and redirects non-admins; data access goes through TanStack Query with the browser Supabase client so RLS enforces permissions.
- Admin writes use shared reusable table + form components (shadcn dialog, form, table) rather than one bespoke screen per entity.
- Existing `src/lib/queries.ts` query options are reused and extended with mutation helpers that invalidate the matching keys.
- Head metadata added for each new route.
