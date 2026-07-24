# Supabase Production Checklist

- Apply migrations in filename order through `202607230006_release_hardening.sql` to preview first.
- Confirm Auth public signup is disabled, redirect allowlists are exact, leaked-password protection is enabled, and Super Admin MFA is enforced operationally.
- Verify RLS and forced RLS on every tenant table; run the cases in `RLS_VERIFICATION.md` using two test organisations.
- Confirm service-role credentials exist only in server deployment secrets.
- Verify `organisation-files`, `organisation-documents`, and `merchant-kyc` are private and paths begin with the authenticated organisation UUID.
- Configure backup/PITR policy, restore drill, alerting, log retention, and migration ownership.
- Review all provider, CMS, plan, and platform seed rows; no test users or transactions are seeded.

This repository review does not verify a remote Supabase project.
