# Security

## Authentication

- Public signup is intentionally absent and must be disabled in Supabase.
- Server code validates users with `auth.getUser()` rather than trusting client session data.
- Password recovery uses Supabase PKCE code exchange through `/auth/callback`.
- Protected layouts repeat authorization after the request proxy redirect check.

## Tenant isolation and RLS

All application tables have RLS enabled and forced. Tenant policies call security-definer helper functions with an empty search path. These functions determine Super Admin status, active membership, and permission grants without exposing unrestricted table reads.

The private Storage bucket applies equivalent organisation checks using the first UUID path segment. Malformed paths resolve to no organisation and are denied.

## Privileged access

The service-role client bypasses RLS and is restricted to server-only code. Prefer user-scoped clients whenever possible. Super Admin status is stored separately from organisation roles and should be granted to the minimum number of accounts.

## Operational controls

- Store secrets only in local/Vercel environment settings.
- Enable MFA for privileged users and enforce strong password policy in Supabase.
- Configure rate limits, bot detection, and email provider controls.
- Review Auth and PostgreSQL audit logs.
- Run dependency and secret scanning in GitHub.
- Back up the database and test restoration.
- Review every new table for RLS before deployment.

## Responsible disclosure

Do not open public issues containing credentials or vulnerability details. Contact the FirstPay security owner through the organisation's private reporting channel.
