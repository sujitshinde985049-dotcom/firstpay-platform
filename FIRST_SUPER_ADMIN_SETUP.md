# First Super Admin Setup

There is no public Super Admin registration. In each environment, an authorised operator creates a normal Auth user through the Supabase administrative console, confirms identity, and sets `profiles.is_super_admin=true` using a reviewed server-side SQL change or one-time administrative script. Record an `audit_events` entry with actor, target, approval reference, and environment. Require MFA before production access, issue a password reset rather than sharing passwords, and revoke by clearing the flag, deactivating the profile, terminating sessions, and recording an audit event.

Never hardcode credentials or perform this procedure in production without two-person approval.
