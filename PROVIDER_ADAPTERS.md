# Provider Adapters

All adapters implement the common `PaymentProviderAdapter`. No provider endpoint or undocumented request field is embedded in code; base URLs and credentials are environment placeholders.

| Provider   | Documented capability represented                                                | Placeholder / limitation                                           | Sandbox     | Production |
| ---------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------- | ---------- |
| Razorpay   | UPI AutoPay, recurring payments, payments, refunds, settlements, signed webhooks | Requests blocked pending merchant-specific API review              | Not tested  | Blocked    |
| PhonePe PG | Payment gateway adapter contract                                                 | Recurring/mandate/signature details require official merchant docs | Not tested  | Blocked    |
| Cashfree   | Subscriptions, mandates, payments, refunds, settlements, signed webhooks         | Requests blocked pending sandbox credentials                       | Not tested  | Blocked    |
| Jio PG     | Typed adapter only                                                               | Official technical specification required                          | Unavailable | Blocked    |
| SabPaisa   | Typed adapter only                                                               | Official technical specification required                          | Unavailable | Blocked    |

Official references reviewed: Razorpay UPI AutoPay and webhook validation documentation; Cashfree subscription overview and webhook signature documentation. PhonePe, Jio PG, and SabPaisa require current official merchant technical packs before capabilities or signatures can be implemented.
