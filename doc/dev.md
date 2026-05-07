# 7 May 2026

## Changes

### 1) Project Initialization

- Next.js app initialized with App Router structure under `src/app`.
- TypeScript and Tailwind CSS v4 setup is active.
- Base app shell and starter homepage are present in `src/app/layout.tsx` and `src/app/page.tsx`.

### 2) UI System Setup (shadcn + utility layer)

- shadcn configuration added in `components.json` with aliases mapped to `@/components`, `@/lib`, and `@/hooks`.
- Global design tokens/theme variables and dark mode utility styles added in `src/app/globals.css`.
- Shared utility function `cn()` added in `src/lib/utils.ts` using `clsx` + `tailwind-merge`.
- Initial reusable UI primitive added: `src/components/ui/button.tsx`.

### 3) Code Quality and Formatting Tooling

- ESLint configured with Next core web vitals + TypeScript + Prettier compatibility in `eslint.config.mjs`.
- Prettier config added in `prettier.config.mjs` with Tailwind plugin enabled.
- `.prettierignore` added for build/generated folders and lockfile exclusions.
- Husky pre-commit hook configured in `.husky/pre-commit` to run `pnpm lint-staged`.
- `package.json` scripts include lint, lint-fix, format, format-check, prepare, and lint-staged workflows.

### 4) Database Foundation: Prisma ORM

- Prisma initialized with `prisma/schema.prisma` and `prisma.config.ts`.
- Prisma moved to v7-compatible config style:
  - datasource URL handling through `prisma.config.ts` (not inside schema URL fields).
  - generator set to `prisma-client` with output at `src/generated/prisma`.
- Prisma import path corrected for generated client usage:
  - `@/generated/prisma/client` is used in runtime code.
- Prisma scripts added in `package.json`:
  - `prisma:generate`
  - `prisma:migrate`
  - `prisma:studio`

### 5) Neon DB Integration

- Neon runtime adapter installed and wired:
  - `@prisma/adapter-neon`
  - `@neondatabase/serverless`
- Prisma client singleton added in `src/lib/prisma.ts` for stable usage in Next.js runtime.
- Environment templates prepared for Neon:
  - `DATABASE_URL` for pooled runtime queries.
  - `DIRECT_URL` for Prisma CLI/migrations.
- `.env.example` added and `.gitignore` updated to allow committing `.env.example`.

### 6) Authentication Feature (MVC + Feature-based Structure)

- Auth routes added:
  - `/login`
  - `/registration`
  - `/forgot-password`
  - `/set-password`
- Reusable brand component added:
  - `src/components/brand/logo.tsx`
  - subtle infinite gradient animation using Framer Motion.
- Login flow implemented:
  - server-side validation and credential verification.
  - password visibility toggle with Lucide eye icons.
  - redirect to `/set-password` when first-login password reset is required.
- Registration flow implemented:
  - fields: `firstName`, `lastName`, `email`, `password`, `companyRole`, `privilageRole`.
  - password auto-generate action.
  - checkbox to enforce password change after first login.
  - Prisma user creation with hashed password.
- Forgot password flow implemented:
  - email input screen and server action.
  - reset email sending via Resend.
- First-login password change flow implemented:
  - `New Password` + `Confirm Password` inputs.
  - updates hashed password and resets first-login flag.
  - redirects back to `/login`.

### 7) Email Service Integration (Resend + React Email)

- Email libraries added:
  - `resend`
  - `@react-email/components`
- Resend client helper added in `src/lib/resend.ts`.
- React Email templates added:
  - reset password email
  - new user credentials email (includes login button).
- Registration now sends credentials email after successful user creation.

### 8) User Schema and Migrations

- `User` model added with:
  - `firstName`
  - `lastName`
  - `email` (unique)
  - `password`
  - `companyRole`
  - `privilageRole`
  - `setPasswordAfterFirstLogin`
  - timestamps
- Migrations created and applied to Neon:
  - `init_user_schema`
  - `add_first_login_password_flag`

### 9) Playwright E2E Testing

- Playwright configuration added:
  - `playwright.config.ts`
- Auth e2e test added:
  - `tests/e2e/auth-flow.spec.ts`
- Script added:
  - `pnpm test:e2e`
- End-to-end auth scenario verified:
  - registration -> first-login redirect -> set-password -> login success.

### 10) Verification Completed

- `pnpm prisma generate` runs successfully.
- `pnpm lint` runs successfully.
- `pnpm build` runs successfully.
- `pnpm test:e2e` runs successfully.

### 11) Current State

- Project now has:
  - initialized UI foundations and design system
  - lint/format and pre-commit guardrails
  - Prisma + Neon database integration with migrations
  - full authentication flow with first-login password change
  - email delivery integration via Resend and React Email templates
  - Playwright e2e coverage for the primary auth journey
