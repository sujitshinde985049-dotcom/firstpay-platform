export type PhonePeMandateInput = {
  id: string;
  organisationId: string;
  customerId: string;
  reference: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startsAt: string | null;
  endsAt: string | null;
  metadata: Record<string, unknown>;
};

export function phonePeMandateMetadata(
  metadata: Record<string, unknown>,
  providerStatus: string,
  authorizationUrl?: string | null,
) {
  return {
    ...metadata,
    provider: "phonepe",
    provider_status: providerStatus,
    ...(authorizationUrl ? { authorization_url: authorizationUrl } : {}),
  };
}

export function firstDatabaseWriteError(
  results: Array<{ error: unknown } | null | undefined>,
) {
  return results.find((result) => result?.error)?.error ?? null;
}

const frequencyMap = {
  daily: "DAILY",
  weekly: "WEEKLY",
  monthly: "MONTHLY",
  quarterly: "QUARTERLY",
  yearly: "YEARLY",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function buildPhonePeMandatePayload(
  mandate: PhonePeMandateInput,
  callbackUrl: string,
) {
  const start = mandate.startsAt ? new Date(mandate.startsAt) : new Date();
  const end = mandate.endsAt
    ? new Date(mandate.endsAt)
    : new Date(start.getTime() + 365 * 86_400_000);
  const duration = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / 86_400_000),
  );

  return {
    merchantSubscriptionId: mandate.id,
    merchantUserId: mandate.customerId,
    subscriptionName: mandate.reference,
    amount: Math.round(mandate.amount * 100),
    currency: "INR" as const,
    frequency: frequencyMap[mandate.frequency],
    duration,
    callbackUrl,
  };
}

export function extractPhonePeAuthorizationUrl(value: unknown): string | null {
  const queue: unknown[] = [value];
  const urlKeys = new Set([
    "authorization_url",
    "authorizationUrl",
    "redirect_url",
    "redirectUrl",
  ]);

  while (queue.length) {
    const current = queue.shift();
    if (!isRecord(current)) continue;
    for (const [key, item] of Object.entries(current)) {
      if (urlKeys.has(key) && typeof item === "string") {
        try {
          const url = new URL(item);
          if (
            url.protocol === "https:" &&
            (url.hostname === "phonepe.com" ||
              url.hostname.endsWith(".phonepe.com"))
          ) {
            return url.toString();
          }
        } catch {
          // Ignore malformed provider URLs.
        }
      }
      if (isRecord(item)) queue.push(item);
    }
  }

  return null;
}
