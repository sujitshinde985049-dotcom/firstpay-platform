# Idempotency

Mandate creation, debit/payment initiation, refunds, webhooks, and settlement imports require an organisation-scoped idempotency key and request hash. A unique database constraint prevents duplicate operation records. Stored responses may be returned only when the key and request hash match. Expired records are cleaned by a trusted job.

An ambiguous debit result is reconciled with the same provider; it is not automatically attempted through another provider.
