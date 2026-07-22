import { z } from "zod";
import type {
  PaymentProvider,
  ProviderConfiguration,
  ProviderEnvironment,
} from "../core/types";
export const providerConfigSchema = z.object({
  provider: z.enum([
    "razorpay",
    "phonepe",
    "cashfree",
    "jio-pg",
    "sabpaisa",
    "mock",
  ]),
  environment: z.enum(["sandbox", "production"]),
  baseUrl: z.string().url().optional(),
  publicIdentifier: z.string().min(1).optional(),
  secretReference: z.string().min(1).optional(),
  webhookSecretReference: z.string().min(1).optional(),
  productionApproved: z.boolean().default(false),
});
export function providerConfig(
  provider: PaymentProvider,
  environment: ProviderEnvironment,
  env: Record<string, string | undefined>,
  prefix: string,
): ProviderConfiguration {
  return providerConfigSchema.parse({
    provider,
    environment,
    baseUrl: env[`${prefix}_BASE_URL`] || undefined,
    publicIdentifier:
      env[`${prefix}_CLIENT_ID`] || env[`${prefix}_KEY_ID`] || undefined,
    secretReference:
      env[`${prefix}_CLIENT_SECRET`] ||
      env[`${prefix}_KEY_SECRET`] ||
      undefined,
    webhookSecretReference: env[`${prefix}_WEBHOOK_SECRET`] || undefined,
    productionApproved: false,
  });
}
