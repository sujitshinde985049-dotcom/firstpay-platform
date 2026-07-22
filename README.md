# FirstPay Platform

Secure multi-tenant SaaS foundation built with Next.js App Router, Supabase, PostgreSQL, TypeScript, and Tailwind CSS.

The repository also includes FirstPay's complete enterprise marketing website, with a mobile-first design system, product education, developer content, legal pages, and technical SEO.

## Capabilities

- Invitation-only Supabase Auth with login, logout, password recovery, and cookie-backed SSR sessions
- Organisation isolation through `organisation_id`, foreign-key integrity, and PostgreSQL Row Level Security
- Platform Super Admin plus organisation roles and permission-based authorization
- Private, organisation-scoped Supabase Storage bucket
- Responsive organisation and platform dashboards with light/dark themes
- React Hook Form and Zod validation
- GitHub Actions and Vercel-ready configuration
- Premium responsive marketing website with Framer Motion interactions
- Open Graph imagery, structured data, sitemap, robots directives, and per-page metadata
- Super Admin command centre with client, user, plan, feature, audit, announcement, media, CMS, and settings management

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
│   └── (marketing)/  # Public website pages with shared header and footer
├── components/       # Auth, dashboard, marketing, provider, and UI components
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

## Public website routes

The marketing surface includes Home, Solutions, UPI AutoPay, e-NACH, Recurring Payments, Mandate Management, Developers, Industries, About, Contact, FAQ, Blog, article details, Privacy, Terms, Refund Policy, Data Security, and System Status.

Shared public components are server-rendered by default. Client JavaScript is limited to the sticky responsive navigation, theme controls, and subtle reduced-motion-aware Framer Motion reveals. The generated social preview is stored at `public/og.png`.

The design system lives in `src/app/globals.css` and defines FirstPay's navy, electric blue, teal, emerald, surface, border, focus, and elevation tokens for light and dark themes.

## Documentation

- [Architecture](./ARCHITECTURE.md)
- [Multi-tenant model](./MULTI_TENANT.md)
- [Security](./SECURITY.md)
- [Supabase setup](./SUPABASE_SETUP.md)
- [Super Admin portal](./ADMIN_PORTAL.md)

## Deployment

Import the repository into Vercel, configure every variable in `.env.example`, and use the Next.js framework preset. The service-role key is server-only. GitHub Actions runs lint, type checking, and the production build for pull requests.
