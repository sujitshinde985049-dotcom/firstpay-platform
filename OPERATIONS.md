# Operations

Monitor database availability, Storage operations, API latency/error rate, notification jobs, webhook failures, and sanitised system events. Configure alert thresholds externally and avoid storing secrets or raw sensitive payloads in logs.

Scheduled workers should atomically claim due CMS publications and notification jobs, use bounded retries with backoff, and record masked terminal errors. CSV exports are available; Excel and PDF remain explicit placeholders.

For incidents: enable maintenance messaging when needed, preserve audit evidence, revoke affected credentials, verify tenant isolation, restore service, and complete a documented review.
