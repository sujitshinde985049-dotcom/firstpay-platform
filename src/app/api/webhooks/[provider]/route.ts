import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  redactWebhook,
  verifyDocumentedWebhook,
} from "@/lib/payments/webhooks/gateway";
import type { PaymentProvider } from "@/lib/payments/core/types";
const providers = new Set<PaymentProvider>([
  "razorpay",
  "phonepe",
  "cashfree",
  "jio-pg",
  "sabpaisa",
]);
const envKeys: Record<string, string> = {
  razorpay: "RAZORPAY_WEBHOOK_SECRET",
  phonepe: "PHONEPE_WEBHOOK_SECRET",
  cashfree: "CASHFREE_WEBHOOK_SECRET",
  "jio-pg": "JIO_PG_WEBHOOK_SECRET",
  sabpaisa: "SABPAISA_WEBHOOK_SECRET",
};
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1024 * 1024)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  const { provider: rawProvider } = await params;
  if (!providers.has(rawProvider as PaymentProvider))
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  const provider = rawProvider as PaymentProvider;
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > 1024 * 1024)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  const secret = process.env[envKeys[provider]];
  if (!secret)
    return NextResponse.json(
      { error: "Webhook verification is not configured" },
      { status: 503 },
    );
  if (!verifyDocumentedWebhook(provider, raw, request.headers, secret))
    return NextResponse.json(
      { error: "Invalid or unsupported webhook signature" },
      { status: 401 },
    );
  const eventId =
    request.headers.get("x-razorpay-event-id") ??
    request.headers.get("x-idempotency-key") ??
    createHash("sha256").update(raw).digest("hex");
  let parsed: unknown = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const supabase = await createClient();
  const { error } = await supabase.from("provider_webhook_events").insert({
    provider,
    event_id: eventId,
    signature_verified: true,
    processing_status: "received",
    safe_metadata: redactWebhook(parsed),
  });
  if (error && error.code !== "23505")
    return NextResponse.json(
      { error: "Unable to persist event" },
      { status: 500 },
    );
  return NextResponse.json({ received: true });
}
