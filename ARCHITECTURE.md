# Architecture

## Runtime boundaries

- **Browser:** uses the publishable Supabase key through `lib/supabase/client.ts`. RLS is the final data boundary.
- **Server Components and actions:** use the cookie-aware client in `lib/supabase/server.ts`.
- **Request proxy:** refreshes authenticated sessions and performs optimistic redirects for protected paths.
- **Admin operations:** use `lib/supabase/admin.ts` only in trusted server-only modules. The service role bypasses RLS.
- **Database:** owns tenant isolation, RBAC relationships, integrity constraints, and authorization functions.

## Request flow

1. Next.js Proxy refreshes the Supabase session.
2. Unauthenticated requests to `/dashboard` or `/super-admin` redirect to `/login`.
3. Protected layouts call server-side guards again; proxy checks are not treated as authorization.
4. Organisation routes resolve the selected active membership.
5. Queries execute with the user's JWT and are constrained by RLS.

## Authorization layers

- `requireUser()` verifies the Supabase user server-side.
- `requireOrganisation()` resolves an active tenant membership.
- `requireSuperAdmin()` checks `profiles.is_super_admin`.
- `hasPermission()` calls the database authorization function, which joins active membership, member roles, role permissions, and permission codes.

## UI

Organisation and platform dashboards share an accessible responsive shell with sidebar, top navigation, breadcrumbs, logout, and theme controls. Tailwind tokens in `globals.css` define the FirstPay corporate palette for light and dark modes.

## Super Admin boundary

The Super Admin portal uses user-scoped Supabase clients for RLS-protected platform data. Server actions call `requireSuperAdmin()` independently of layout protection and record sensitive operations in `audit_events`. The server-only service-role client is limited to Supabase Auth Admin and Storage operations that cannot be performed with a user session.
