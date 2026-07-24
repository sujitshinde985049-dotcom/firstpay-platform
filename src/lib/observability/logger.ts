import { randomUUID } from "node:crypto";
const sensitive =
  /(password|token|secret|authorization|cookie|otp|pin|account|pan|vpa|kyc|encryption)/i;
export const correlationId = (incoming?: string | null) =>
  incoming?.slice(0, 128) || randomUUID();
export function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitive.test(key) ? "[REDACTED]" : redact(item),
      ]),
    );
  return value;
}
export function logServerEvent(
  level: "info" | "warn" | "error",
  event: string,
  metadata: Record<string, unknown> = {},
) {
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event,
    metadata: redact(metadata),
  };
  const output = JSON.stringify(record);
  if (level === "error") console.error(output);
  else if (level === "warn") console.warn(output);
  else console.info(output);
}
