# Vercel Environment Variables

Public: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, optional `NEXT_PUBLIC_VERCEL_ANALYTICS`.

Server-only: `SUPABASE_SERVICE_ROLE_KEY`, rate-limit Redis URL/token, error tracking DSN, SMTP values, provider credentials/webhook secrets/base URLs, and `PAYMENT_CREDENTIAL_ENCRYPTION_KEY`. Separate Preview and Production values. Never expose server variables with `NEXT_PUBLIC_`, print them in logs, or copy production secrets into preview.
