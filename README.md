# EasyCampus

EasyCampus is now structured for a `Vercel + Supabase + GitHub` MVP path, while still preserving the original static marketing site in the repository root.

## Recommended Deployment Path

- Web app: `apps/web` on Vercel
- Database, auth, storage: Supabase
- Source control and CI: GitHub
- Mobile shell: `apps/mobile`
- Optional legacy backend path: `apps/api`

## Monorepo Apps

- `apps/web`: Next.js + Tailwind + TypeScript app for marketing pages, dashboards, and Next.js route handlers
- `apps/api`: optional Express starter for future dedicated backend work
- `apps/mobile`: React Native Expo-style student app shell

## Shared Packages

- `packages/ui`: shared UI helpers and primitives
- `packages/types`: shared domain types
- `packages/config`: shared product config and navigation metadata

## Supabase Setup

- SQL schema: [supabase/schema.sql](C:\Prisha\Easycampus\supabase\schema.sql)
- Sample data seed: [supabase/seed.sql](C:\Prisha\Easycampus\supabase\seed.sql)
- Local env example: [apps/web/.env.example](C:\Prisha\Easycampus\apps\web\.env.example)
- Repo env example: [\.env.example](C:\Prisha\Easycampus\.env.example)

Required environment variables for `apps/web`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `SUPER_ADMIN_EMAILS`
- `OBSERVABILITY_WEBHOOK_URL` (optional)

## Getting Started

1. Install dependencies:
   - `corepack pnpm install`
2. Copy env values:
   - `copy apps\\web\\.env.example apps\\web\\.env.local`
3. Create a Supabase project.
4. Run [supabase/schema.sql](C:\Prisha\Easycampus\supabase\schema.sql) in the Supabase SQL editor.
5. Optionally run [supabase/seed.sql](C:\Prisha\Easycampus\supabase\seed.sql) to load sample campus data.
6. Start the web app:
   - `corepack pnpm dev:web`

Optional:

- `corepack pnpm dev:mobile`
- `corepack pnpm dev:api`

## GitHub to Vercel Deployment

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. In Vercel project settings, set the Root Directory to `apps/web`.
4. Add the Supabase environment variables in Vercel.
5. Add `CRON_SECRET` in Vercel and invoke the same secret from the cron request.
6. Optionally add `SUPER_ADMIN_EMAILS` and `OBSERVABILITY_WEBHOOK_URL`.
7. Deploy.

The web app has been prepared so Vercel only needs the `apps/web` project. The separate Express app is not required for the MVP deployment path.

## Current Modules

- Admin signup and invite onboarding
- Admin CRUD for departments, courses, and subjects
- Student marks module backed by Supabase `marks` and `exams`
- Student timetable module backed by Supabase `timetable_entries`
- Role-protected dashboards with live Supabase metrics

## Static Site

The root `*.html` files remain available if you want a very simple GitHub Pages version of the marketing site.

## Architecture Docs

- [docs/07-deployment-architecture.md](C:\Prisha\Easycampus\docs\07-deployment-architecture.md)
- [docs/09-system-architecture.md](C:\Prisha\Easycampus\docs\09-system-architecture.md)
- [docs/10-vercel-supabase-deployment.md](C:\Prisha\Easycampus\docs\10-vercel-supabase-deployment.md)
