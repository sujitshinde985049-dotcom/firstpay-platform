import { timingSafeEqual, createHmac } from "node:crypto";
import type { PaymentProvider } from "../core/types";
const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};
export function verifyDocumentedWebhook(
  provider: PaymentProvider,
  raw: string,
  headers: Headers,
  secret: string,
) {
  if (provider === "razorpay") {
    const received = headers.get("x-razorpay-signature");
    if (!received) return false;
    return safeEqual(
      createHmac("sha256", secret).update(raw).digest("hex"),
      received,
    );
  }
  if (provider === "cashfree") {
    const received = headers.get("x-webhook-signature");
    const timestamp = headers.get("x-webhook-timestamp");
    const timestampMs = Number(timestamp);
    if (
      !received ||
      !timestamp ||
      !Number.isFinite(timestampMs) ||
      Math.abs(Date.now() - timestampMs) > 300000
    )
      return false;
    return safeEqual(
      createHmac("sha256", secret)
        .update(timestamp + raw)
        .digest("base64"),
      received,
    );
  }
  return false;
}
export const redactWebhook = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(redactWebhook);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([k]) =>
            !/(secret|token|authorization|account|pan|card|vpa)/i.test(k),
        )
        .map(([k, v]) => [k, redactWebhook(v)]),
    );
  return value;
};
