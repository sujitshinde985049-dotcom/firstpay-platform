# Deployment

1. Create production and preview Supabase projects.
2. Apply migrations in filename order through `202607220004_enterprise_operations.sql`.
3. Configure the variables documented in `.env.example` in Vercel.
4. Deploy the feature branch to a preview environment and run authentication, RLS, Storage, CMS scheduling, and export smoke tests.
5. Promote through the normal pull-request and release process only after review.

Service-role credentials are server-only and must never use the `NEXT_PUBLIC_` prefix. Rotate credentials after suspected exposure.
