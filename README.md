# FirstPay Platform

Secure multi-tenant SaaS foundation built with Next.js App Router, Supabase, PostgreSQL, TypeScript, and Tailwind CSS.

## Capabilities

- Invitation-only Supabase Auth with login, logout, password recovery, and cookie-backed SSR sessions
- Organisation isolation through `organisation_id`, foreign-key integrity, and PostgreSQL Row Level Security
- Platform Super Admin plus organisation roles and permission-based authorization
- Private, organisation-scoped Supabase Storage bucket
- Responsive organisation and platform dashboards with light/dark themes
- React Hook Form and Zod validation
- GitHub Actions and Vercel-ready configuration

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer
- Supabase CLI for local migrations
- A Supabase project with public signup disabled

## Local setup

```bash
cp .env.example .env.local
npm install
npx supabase link --project-ref <project-ref>
npx supabase db push
npm run dev
```

Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) before applying the migration.

## Commands

| Command                | Purpose                       |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Start local development       |
| `npm run lint`         | Run ESLint with zero warnings |
| `npm run typecheck`    | Validate TypeScript           |
| `npm run format`       | Format supported files        |
| `npm run format:check` | Check formatting              |
| `npm run build`        | Create the production build   |

## Structure

```text
src/
├── app/              # Routes, layouts, auth callback, and server actions
├── components/       # Auth, dashboard shell, provider, and UI components
├── config/           # Application configuration
├── features/         # Domain modules
├── hooks/            # Shared React hooks
├── lib/
│   ├── auth/         # User, Super Admin, role, and permission guards
│   ├── organisations/# Active tenant resolution
│   └── supabase/     # Browser, server, admin, and request-proxy clients
├── services/         # External service clients
└── types/            # Shared types
supabase/migrations/  # Versioned PostgreSQL schema and RLS policies
```

## Documentation

- [Architecture](./ARCHITECTURE.md)
- [Multi-tenant model](./MULTI_TENANT.md)
- [Security](./SECURITY.md)
- [Supabase setup](./SUPABASE_SETUP.md)

## Deployment

Import the repository into Vercel, configure every variable in `.env.example`, and use the Next.js framework preset. The service-role key is server-only. GitHub Actions runs lint, type checking, and the production build for pull requests.
