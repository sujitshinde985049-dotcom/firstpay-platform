import { PlaceholderAdapter } from "./base-placeholder-adapter";
import { providerConfig } from "./config";
import { PhonePeAdapter } from "./phonepe-adapter";
import type {
  PaymentProvider,
  ProviderCapability,
  ProviderEnvironment,
} from "../core/types";
const documented: Partial<Record<PaymentProvider, ProviderCapability[]>> = {
  razorpay: [
    "upi_autopay",
    "recurring_debit",
    "one_time_payment",
    "refund",
    "settlement",
    "mandate_cancel",
    "webhook",
    "sandbox",
  ],
  cashfree: [
    "upi_autopay",
    "e_nach",
    "recurring_debit",
    "one_time_payment",
    "refund",
    "settlement",
    "mandate_pause",
    "mandate_cancel",
    "webhook",
    "sandbox",
  ],
  "jio-pg": [],
  sabpaisa: [],
};
export class ConfiguredPlaceholderAdapter extends PlaceholderAdapter {
  readonly config;
  readonly capabilities;
  constructor(
    provider: Exclude<PaymentProvider, "mock">,
    prefix: string,
    environment: ProviderEnvironment,
    env: Record<string, string | undefined> = process.env,
  ) {
    super();
    this.config = providerConfig(provider, environment, env, prefix);
    this.capabilities = new Set(documented[provider] ?? []);
  }
}
export const createProviderAdapters = (
  environment: ProviderEnvironment,
  env: Record<string, string | undefined> = process.env,
) => [
  new ConfiguredPlaceholderAdapter("razorpay", "RAZORPAY", environment, env),
  new PhonePeAdapter(environment, env),
  new ConfiguredPlaceholderAdapter("cashfree", "CASHFREE", environment, env),
  new ConfiguredPlaceholderAdapter("jio-pg", "JIO_PG", environment, env),
  new ConfiguredPlaceholderAdapter("sabpaisa", "SABPAISA", environment, env),
];
