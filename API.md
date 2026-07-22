# FirstPay API Architecture

FirstPay exposes versioned REST and webhook contracts behind server-side authentication. API credentials store only a display prefix and one-way hash. Keys are displayed once and support scopes, rotation, expiry, and revocation.

## Boundaries

- `/v1/customers`, `/v1/mandates`, `/v1/payments`, and `/v1/settlements` are documented contracts and provider-neutral placeholders.
- Webhook deliveries retain masked request/response summaries, attempt counts, retry time, and outcome.
- No real UPI AutoPay, e-NACH, bank, SMS, or WhatsApp processing is enabled.
- Every tenant request must derive `organisation_id` from authenticated membership, never from an untrusted client claim.

See `/api-docs` for the public developer experience.
