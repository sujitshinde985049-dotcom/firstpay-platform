# RLS Verification

Create two disposable organisations and non-privileged users in a non-production Supabase project. For every tenant table, insert one row per organisation and verify each user can read only its own row, cannot create/update/delete another tenant's row, and loses access when membership or organisation is suspended. Verify ordinary users cannot modify audit events, platform settings, provider credentials, roles, or Super Admin flags. Test Storage list/read/write/delete with both organisation UUID prefixes.

Run tests with the publishable key and user sessions—not the service role. Record SQL, identities, timestamps, and results as release evidence. These checks have not been run remotely in this task.
