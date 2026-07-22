# Go-Live Checklist

- Official current provider documentation and merchant technical pack reviewed.
- Sandbox credentials, base URL, webhook secret, and supported capabilities verified.
- All adapter and webhook tests pass against the official sandbox.
- Approved KMS/encryption service stores credentials; keys remain outside the database.
- Tenant and Storage RLS tests pass; logs/exports contain no secrets.
- Idempotency, replay protection, circuit breaker, retry, and reconciliation drills pass.
- KYC malware scanning and retention controls are operational.
- Separate production credentials and webhooks configured.
- Super Admin records explicit live approval.
- Monitoring, incident response, rollback, and provider support contacts are ready.
