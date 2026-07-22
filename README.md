# FirstPay Platform

Production-ready web foundation for FirstPay, built with Next.js App Router, TypeScript, Tailwind CSS, and automated quality checks.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command                | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the local development server      |
| `npm run lint`         | Run ESLint with zero warnings allowed   |
| `npm run typecheck`    | Validate TypeScript types               |
| `npm run format`       | Format supported files with Prettier    |
| `npm run format:check` | Check formatting without changing files |
| `npm run build`        | Create a production build               |

Husky and lint-staged run ESLint and Prettier on staged files before every commit.

## Structure

```text
src/
├── app/          # App Router pages, layouts, and route handlers
├── components/   # Shared UI components
├── config/       # Application configuration
├── features/     # Domain-focused feature modules
├── hooks/        # Shared React hooks
├── lib/          # Framework-agnostic utilities
├── services/     # External service and API clients
└── types/        # Shared TypeScript types
```

## Deployment

The repository includes a GitHub Actions quality workflow and `vercel.json`. Import the repository into Vercel, select the Next.js framework preset, and configure values from `.env.example` in the Vercel project settings. Pull requests receive preview deployments when Vercel's GitHub integration is enabled.

## Environment variables

Copy `.env.example` to `.env.local`. Never commit secrets or `.env.local`.
