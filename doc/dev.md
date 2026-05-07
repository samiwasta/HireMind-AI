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

### 6) Verification Completed

- `pnpm prisma generate` runs successfully.
- `pnpm lint` runs successfully.

### 7) Current State

- Project now has initialized UI foundations, lint/format guardrails, and a working Prisma + Neon DB setup.
- Next pending step is defining actual Prisma models and running the first migration.
