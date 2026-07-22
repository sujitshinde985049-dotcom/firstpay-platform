# Super Admin portal

The portal is available under `/super-admin` and is protected twice: Next.js request proxy authentication and the server-side `requireSuperAdmin()` guard. Every server action repeats the Super Admin check before reading or mutating privileged data.

## Modules

- **Overview:** client, user, lead, API, storage, ticket, and audit metrics with growth, plan, usage, and adoption charts.
- **Clients:** searchable and filterable client list, pagination, CSV export, create/edit, plan and branding assignment, activation, suspension, and soft deletion.
- **Client Admin:** invitation, password recovery, activation controls, role assignment, and membership removal.
- **Users:** platform/client filters, organisation role assignment, deactivation, activation, and soft deletion.
- **Plans:** Starter, Growth, Business, Enterprise, and Custom limits for users, storage, requests, webhooks, reports, and priority support.
- **Feature flags:** platform defaults plus per-client overrides.
- **Audit:** action, organisation, severity, and date filtering with CSV export.
- **Announcements:** audience, priority, schedule, publish, and expiry controls.
- **Media:** validated Supabase Storage uploads, folders, preview links, rename, and delete controls.
- **CMS:** structured management for homepage, hero, statistics, footer, navigation, FAQs, testimonials, partners, logos, blog, legal, and SEO entries.
- **Settings:** company contact details, branding paths, SMTP placeholders, analytics placeholders, theme, and maintenance mode.

## Database setup

Apply both migrations in order:

```bash
npx supabase db push
```

The second migration seeds plans and baseline platform settings, creates the public `platform-media` bucket with Super Admin-only writes, and forces RLS on every new administrative table.

## Operational notes

- Configure Supabase email templates and SMTP before using invitations or password recovery in production.
- The service-role key is used only in server-only code for Auth Admin and Storage operations.
- CSV exports are generated on authenticated server routes and never expose deleted records.
- Media validation permits JPEG, PNG, WebP, GIF, and PDF up to 10 MB.
