# Supabase setup

## 1. Create and configure the project

1. Create a Supabase project.
2. In **Authentication > Providers > Email**, disable **Allow new users to sign up**. FirstPay is invitation-only.
3. Configure the Site URL and allowed redirect URLs:
   - Local: `http://localhost:3000/auth/callback`
   - Production: `https://<your-domain>/auth/callback`
   - Vercel previews as required by your deployment policy
4. Copy `.env.example` to `.env.local` and populate the project URL, publishable key, and server-only service-role key.

Never expose `SUPABASE_SERVICE_ROLE_KEY` through `NEXT_PUBLIC_*`, client components, logs, or browser responses.

## 2. Apply the schema

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

The migration creates the application tables, helper functions, triggers, indexes, RLS policies, and private `organisation-files` Storage bucket.

## 3. Bootstrap a Super Admin

Create the initial user from the Supabase dashboard or Admin API, then run this once in the SQL editor:

```sql
update public.profiles
set is_super_admin = true
where id = '<auth-user-uuid>';
```

Use the Super Admin account to create organisations and invite users. Do not add a public sign-up route.

## 4. Storage convention

Objects in `organisation-files` must begin with the organisation UUID:

```text
<organisation_id>/<resource>/<filename>
```

Storage RLS derives the tenant from the first path segment and rejects access outside the current user's organisations.

## 5. Generate database types

After applying migrations, generate types and replace untyped query inference as the schema evolves:

```bash
npx supabase gen types typescript --linked > src/types/database.generated.ts
```
