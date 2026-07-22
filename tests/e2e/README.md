# E2E test environment

Public and unauthenticated flows are automated. Authenticated Super Admin, tenant isolation, suspended organisation, organisation switching, duplicate webhook, sandbox/live, and safe configuration flows require an isolated Supabase project and deterministic fixture identities. Add those credentials only to the CI environment and never commit them. Do not run E2E against production.
