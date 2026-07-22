# Multi-tenant model

## Tenant boundary

`organisations.id` is the tenant identifier. Every tenant-owned relationship includes `organisation_id`. Composite foreign keys on role and membership join tables prevent identifiers from different organisations being combined, even through privileged code.

## Membership and role model

```text
organisation
  ├── organisation_members ── profile/auth user
  ├── organisation_roles
  ├── organisation_permissions
  ├── organisation_role_permissions
  ├── organisation_member_roles
  └── feature_flags
```

Creating an organisation automatically provisions Admin, Manager, Sales, Support, Finance, Developer, and Viewer roles plus their default permission mappings.

## Active organisation

`getCurrentOrganisation()` reads the optional `firstpay_organisation_id` cookie and validates it against the authenticated user's active memberships. Without a selection, it returns the first active membership. `requireOrganisation()` redirects accounts without a tenant assignment.

The cookie is only a preference; it never grants access. Database RLS verifies membership independently.

## Adding tenant tables

Every new tenant resource must:

1. Use a UUID primary key.
2. Include a non-null `organisation_id` foreign key.
3. Index `organisation_id` with common query fields.
4. Enable and force RLS.
5. Add explicit policies using `is_organisation_member()` or `has_permission()`.
6. Include `organisation_id` in composite foreign keys where cross-tenant ID mixing is possible.
7. Scope every server query by organisation even when RLS is enabled.
