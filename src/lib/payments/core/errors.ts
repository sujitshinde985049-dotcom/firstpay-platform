import type { PaymentProvider } from "./types";
export class ConfigurationError extends Error {
  constructor(
    public provider: PaymentProvider,
    message: string,
  ) {
    super(message);
    this.name = "ConfigurationError";
  }
}
export class WebhookSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebhookSecurityError";
  }
}
