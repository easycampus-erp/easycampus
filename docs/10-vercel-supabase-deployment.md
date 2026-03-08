# 10. Vercel + Supabase Deployment

## Recommended Zero-Dollar MVP Stack

- Frontend and API routes: Vercel
- Database, auth, storage: Supabase
- Source control and deployment trigger: GitHub
- Mobile shell: Expo / React Native

## Vercel Setup

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Set the Vercel Root Directory to `apps/web`.
4. Keep the framework as `Next.js`.
5. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Supabase Setup

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run [supabase/schema.sql](C:\Prisha\Easycampus\supabase\schema.sql).
4. Optionally run [supabase/seed.sql](C:\Prisha\Easycampus\supabase\seed.sql) to load a sample campus dataset.
5. Copy the project URL, anon key, and service role key into local env and Vercel env settings.

## Local Development

1. Run `corepack pnpm install`
2. Copy `apps/web/.env.example` to `apps/web/.env.local`
3. Start the web app with `corepack pnpm dev:web`

## Current Supabase-Ready Features

- Next.js route handler: `/api/health`
- Next.js route handler: `/api/request-demo`
- Next.js route handler: `/api/signup/admin`
- Next.js route handler: `/api/invitations`
- Demo form writes to `request_demo_leads`
- First-admin signup flow
- Admin invite flow for faculty, mentors, students, and admins
- Admin CRUD screens for departments, courses, and subjects
- Student marks module on real `marks` and `exams` tables
- Student timetable module on real `timetable_entries` data
- Role-protected dashboard routes with Supabase Auth
- Supabase-backed dashboard metrics with a safe no-env fallback for builds
- Seed file includes a sample institution, academic structure, attendance, marks, timetable, mentorship, and announcements
- Schema includes institutions, profiles, memberships, invites, departments, courses, subjects, students, faculty, mentors, mentor groups, mentor meetings, attendance, exams, marks, timetable, announcements, and demo leads

## Auth Role Mapping

- `admin` -> `/admin`
- `faculty` -> `/faculty`
- `mentor` -> `/mentor`
- `student` -> `/student`

Set the role on the Supabase user in `app_metadata.role` or invite the user through the admin onboarding flow so the role is created automatically.

## MVP Recommendation

For the first launch, use the `apps/web` project only. The separate Express app can stay in the repo for future dedicated backend work, but it is not required for the Vercel deployment path.
