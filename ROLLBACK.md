# Rollback

Pause promotion, preserve evidence, and revert application traffic to the last verified Vercel deployment. Database migrations require an explicit forward-fix or reviewed compensating migration; never destructively roll back financial or audit data. Restore from backup only under the recovery runbook. Revalidate Auth, RLS, webhook idempotency, provider routing, reconciliation, and tenant access before reopening traffic.
