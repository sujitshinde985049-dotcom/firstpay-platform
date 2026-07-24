# Webhook Security

Webhook routes receive raw request bodies. Razorpay verification uses the officially documented HMAC-SHA256 hex signature and `x-razorpay-event-id` replay identifier. Cashfree verification uses the documented timestamp plus raw body, HMAC-SHA256 Base64 signature, and a five-minute replay window.

PhonePe, Jio PG, and SabPaisa production webhooks return an invalid/unsupported signature response until official specifications are configured. Verified events are uniquely persisted, sensitive fields are redacted, and provider status is never trusted before signature verification.
