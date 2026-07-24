import { z } from "zod";

const optionalUrl = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.url().optional(),
);
const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_VERCEL_ANALYTICS: z.enum(["true", "false"]).optional(),
});
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RATE_LIMIT_REDIS_URL: optionalUrl,
  RATE_LIMIT_REDIS_TOKEN: z.string().min(1).optional(),
  ERROR_TRACKING_DSN: optionalUrl,
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  PAYMENT_CREDENTIAL_ENCRYPTION_KEY: z.string().min(32).optional(),
  PHONEPE_ENV: z.enum(["UAT", "PRODUCTION", "uat", "production"]).optional(),
  PHONEPE_CLIENT_ID: z.string().min(1).optional(),
  PHONEPE_CLIENT_SECRET: z.string().min(1).optional(),
  PHONEPE_CLIENT_VERSION: z.string().min(1).optional(),
  PHONEPE_TEST_MID: z.string().min(1).optional(),
  PHONEPE_BASE_URL: optionalUrl,
});
export type PublicEnvironment = z.infer<typeof publicSchema>;
export type ServerEnvironment = z.infer<typeof serverSchema>;
export function parsePublicEnvironment(
  source: Record<string, string | undefined> = process.env,
) {
  const result = publicSchema.safeParse(source);
  if (!result.success)
    throw new Error(
      "Required public application configuration is missing or invalid.",
    );
  return result.data;
}
export function parseServerEnvironment(
  source: Record<string, string | undefined> = process.env,
) {
  const result = serverSchema.safeParse(source);
  if (!result.success)
    throw new Error(
      "Server configuration is invalid. Contact platform operations.",
    );
  if (
    source.NODE_ENV === "production" &&
    !result.data.SUPABASE_SERVICE_ROLE_KEY
  )
    throw new Error("Required production server configuration is missing.");
  return result.data;
}
export const optionalProviderEnvironment = (
  source: NodeJS.ProcessEnv = process.env,
) => ({
  razorpay: {
    baseUrl: source.RAZORPAY_BASE_URL,
    configured: Boolean(source.RAZORPAY_KEY_ID && source.RAZORPAY_KEY_SECRET),
  },
  phonepe: {
    environment: source.PHONEPE_ENV,
    baseUrl: source.PHONEPE_BASE_URL,
    configured: Boolean(
      source.PHONEPE_ENV &&
      source.PHONEPE_CLIENT_ID &&
      source.PHONEPE_CLIENT_SECRET &&
      source.PHONEPE_CLIENT_VERSION &&
      source.PHONEPE_TEST_MID &&
      source.PHONEPE_BASE_URL,
    ),
  },
  cashfree: {
    baseUrl: source.CASHFREE_BASE_URL,
    configured: Boolean(
      source.CASHFREE_CLIENT_ID && source.CASHFREE_CLIENT_SECRET,
    ),
  },
  jioPg: {
    baseUrl: source.JIO_PG_BASE_URL,
    configured: Boolean(source.JIO_PG_CLIENT_ID && source.JIO_PG_CLIENT_SECRET),
  },
  sabPaisa: {
    baseUrl: source.SABPAISA_BASE_URL,
    configured: Boolean(
      source.SABPAISA_CLIENT_ID && source.SABPAISA_CLIENT_SECRET,
    ),
  },
});
