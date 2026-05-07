## HireMind AI

HireMind AI is a Next.js app with Prisma ORM + Neon PostgreSQL setup, Tailwind CSS v4, and shadcn UI foundations.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- shadcn UI
- Prisma ORM v7
- Neon PostgreSQL
- ESLint + Prettier + Husky + lint-staged

## Project Structure

- `src/app`: App Router pages/layouts and global styles
- `src/components`: shared UI components (including shadcn primitives)
- `src/lib`: shared utilities and Prisma client instance
- `prisma`: Prisma schema and migrations
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

3. Update `.env` with your Neon credentials:

- `DATABASE_URL`: Neon pooled URL (runtime queries)
- `DIRECT_URL`: Neon direct URL (Prisma CLI/migrations)

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

## Database Notes (Prisma v7 + Neon)

- Prisma schema uses `prisma-client` generator with output in `src/generated/prisma`.
- Prisma CLI connection is configured in `prisma.config.ts` using `DIRECT_URL`.
- Runtime Prisma client uses Neon adapter from `@prisma/adapter-neon` in `src/lib/prisma.ts`.

## Development Log

Current progress is tracked in `doc/dev.md`.
