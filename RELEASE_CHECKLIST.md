# Release Checklist

Feature branch → reviewed PR → CI → isolated Vercel preview → manual/E2E smoke review → Supabase migration/RLS evidence → environment confirmation → security/legal/provider approval → merge approval → production deployment → smoke tests → monitoring. Stop and roll back on tenant-isolation, authentication, financial-integrity, migration, or secret-handling failures.
