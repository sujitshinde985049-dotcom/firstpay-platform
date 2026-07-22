import type { RetryPolicy } from "./types";
export const financialRetryPolicy: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
  retryableCategories: ["timeout", "provider"],
  allowCrossProviderDebitRetry: false,
};
export const retryDelay = (attempt: number, p = financialRetryPolicy) =>
  Math.min(p.maxDelayMs, p.baseDelayMs * 2 ** Math.max(0, attempt - 1));
