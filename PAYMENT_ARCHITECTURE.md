# Payment Architecture

FirstPay uses a provider-independent adapter contract, registry, capability-aware router, idempotency records, bounded retry policy, circuit breaker, normalised statuses, secure webhook gateway, and reconciliation records. Business modules must not import provider SDKs directly.

Production calls are blocked until configuration, external secret storage, official documentation review, sandbox evidence, and Super Admin approval exist. Financial debits cannot automatically fail over across providers without proven idempotency and duplicate-debit protection.
