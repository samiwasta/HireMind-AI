## HireMind AI

HireMind AI is a Next.js app with Prisma ORM + Neon PostgreSQL setup, Tailwind CSS v4, and shadcn UI foundations.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- shadcn UI
- Prisma ORM v7
- Neon PostgreSQL
- Resend (transactional email)
- React Email components
- Playwright (E2E)
- ESLint + Prettier + Husky + lint-staged

## Project Structure

- `src/app`: App Router pages/layouts and global styles
- `src/components`: shared UI components (including shadcn primitives)
- `src/features`: feature-based modules (MVC structure for auth)
- `src/features/dashboard`: modular dashboard (model/controller/view; overview streaming sections and skeletons under `view/`)
- `src/features/companies`: recruiter flows for **Companies** accounts (`Companies_User`): create (dialog), list, edit, delete, emails, company set-password link
- `src/lib`: shared utilities and Prisma client instance
- `prisma`: Prisma schema and migrations
- `tests/e2e`: Playwright end-to-end tests
- `doc`: progress and development docs

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create local env file from example:

```bash
cp .env.example .env
```

3. Update `.env` with required values:

- `DATABASE_URL`: Neon pooled URL (runtime queries)
- `DIRECT_URL`: Neon direct URL (Prisma CLI/migrations)
- `RESEND_API_KEY`: API key from Resend
- `RESEND_FROM_EMAIL`: verified sender email/domain in Resend
- `NEXT_PUBLIC_APP_URL`: app URL (for links in emails)
- `AUTH_JWT_SECRET`: secret used to sign the auth JWT session cookie and **company setup** tokens (invite / set-password links for `Companies_User`)

4. Generate Prisma client:

```bash
pnpm prisma:generate
```

5. Start development server:

```bash
pnpm dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev`: run local dev server
- `pnpm build`: production build
- `pnpm start`: run production server
- `pnpm lint`: run ESLint
- `pnpm lint:fix`: auto-fix ESLint issues
- `pnpm format`: run Prettier write
- `pnpm format:check`: check Prettier formatting
- `pnpm prisma:generate`: generate Prisma client
- `pnpm prisma:migrate`: create/apply development migration
- `pnpm prisma:studio`: open Prisma Studio
- `pnpm test:e2e`: run Playwright end-to-end tests

## Database Notes (Prisma v7 + Neon)

- Prisma schema uses `prisma-client` generator with output in `src/generated/prisma`.
- Prisma CLI connection is configured in `prisma.config.ts` using `DIRECT_URL`.
- Runtime Prisma client uses Neon adapter from `@prisma/adapter-neon` in `src/lib/prisma.ts`.
- Runtime import should use `@/generated/prisma/client`.

## Authentication Flow

- `/login`: email + password login with validation.
- JWT session cookie is created after successful login.
- `/registration`: register users with:
  - first/last name
  - email
  - password (manual or auto-generated)
  - company role
  - privilage role
  - optional first-login password reset requirement
- `/set-password`: forced password change flow for first login users.
- `/forgot-password`: email-based reset request flow.
- `/logout`: clears auth session and redirects to login.

## Email Flow (Resend + React Email)

- Forgot-password action sends reset email.
- Registration action sends credentials email with login button.
- Email templates live under `src/features/auth/view/emails`.

## Testing

- Playwright setup is configured in `playwright.config.ts`.
- Current e2e test validates:
  - registration
  - first-login redirect to set-password
  - password change
  - login with new password and redirect to `/overview`

## Companies (recruiter)

- **`/companies`:** HireMind users (recruiters) create **company accounts** stored as `Companies_User`. UI: **Add Company** opens a dialog; the table supports **edit** and **delete** (only companies **you** created: `createdByUserId`).
- **Create:** Optional or generated temporary password; optional onboarding email via Resend (`RESEND_*`) with a **Set password** link to **`/companies/set-password?token=...`** (JWT, requires `AUTH_JWT_SECRET` and `NEXT_PUBLIC_APP_URL`).
- **Public set-password:** Company users set a new password there, then sign in at `/login` when company login is wired to the same credentials.
- Code lives under `src/features/companies/` (controllers, forms, dialogs, React Email template).

## Dashboard Architecture

- Authenticated landing route is `/overview`.
- `/dashboard` redirects to `/overview` for compatibility.
- Dashboard follows feature-based modular design:
  - `model`: navigation/profile contracts
  - `controller`: authenticated data loaders (stats, analytics, activity, etc.) scoped to the JWT user
  - `view`: shell, sidebar, overview sections, and streaming helpers (see below)
- Overview body uses **Suspense streaming**: the page loads the user profile first, then streams stats, analytics, activity/candidates, and insights/interviews as separate segments with skeleton fallbacks (`overview-skeletons.tsx`, `overview-streaming-sections.tsx`).
- **`getAuthSession`** is wrapped with React **`cache()`** so parallel server requests in one navigation share a single session read/verify.
- Sidebar includes:
  - hierarchical navigation groups (main nav: Overview, Interviews, Candidates, **Companies** → `/companies`, AI Evaluations, Analytics)
  - profile card with initials
  - logout action
  - subtle Framer Motion micro-animations

## Overview Modules

Overview is now composed of modular, DB-backed sections:

- Stats cards:
  - Active Interviews
  - Candidates
  - AI Evaluations
  - Shortlisted
- Analytics:
  - Hiring Funnel
  - Weekly Activity
- Recent Activity feed:
  - latest interview/evaluation/shortlist events
- Top Candidates:
  - AI score, recommendation, confidence
- AI Insights:
  - generated insight cards derived from evaluation data and summaries
- Upcoming Interviews:
  - list + calendar toggle view with day-level interview tooltips

All overview modules render from real database queries scoped to the authenticated user.  
When no records exist, sections show empty states instead of synthetic/demo rows.

While segments are loading, skeleton placeholders mirror card layout and fixed heights (feed/chart areas) to keep the UI stable.

## Notes

- Next dev indicator icon is disabled in `next.config.ts` via `devIndicators: false`.

## Development Log

Current progress is tracked in `doc/dev.md`.
