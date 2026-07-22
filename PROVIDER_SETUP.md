# Provider Setup

Provide sandbox base URL and sandbox credentials through the deployment secret manager. Create separate webhook secrets and records per environment. Register verified capabilities, assign providers to an organisation, run health checks, and retain sandbox evidence.

Live mode additionally requires `PAYMENT_CREDENTIAL_ENCRYPTION_KEY` through an approved encryption/KMS abstraction, production credentials, webhook verification tests, reconciliation review, security approval, and explicit Super Admin live approval. Environment variables alone are placeholders and do not make an adapter production-ready.
