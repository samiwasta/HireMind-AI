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
- `src/features/dashboard`: modular dashboard (model/controller/view)
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
- `AUTH_JWT_SECRET`: secret used to sign auth JWT session cookie

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

## Dashboard Architecture

- Authenticated landing route is `/overview`.
- `/dashboard` redirects to `/overview` for compatibility.
- Dashboard follows feature-based modular design:
  - `model`: navigation/profile contracts
  - `controller`: authenticated profile retrieval from DB via JWT session
  - `view`: shell and sidebar components separated
- Sidebar includes:
  - hierarchical navigation groups
  - profile card with initials
  - logout action
  - subtle Framer Motion micro-animations

## Notes

- Next dev indicator icon is disabled in `next.config.ts` via `devIndicators: false`.

## Development Log

Current progress is tracked in `doc/dev.md`.
