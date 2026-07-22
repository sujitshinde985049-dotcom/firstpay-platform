import { ProductPage } from "@/components/marketing/product-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "UPI AutoPay",
  "Create frictionless UPI recurring payment experiences with real-time mandate and collection visibility.",
  "/upi-autopay",
);

export default function UpiAutoPayPage() {
  return (
    <ProductPage
      content={{
        eyebrow: "UPI AutoPay",
        title: "Recurring collections customers can approve in seconds",
        description:
          "Create UPI mandates, automate collections, and manage the full lifecycle through one enterprise-grade integration.",
        outcomes: [
          "Fast mobile-first authorization",
          "Real-time mandate status",
          "Automated collection schedules",
          "Intelligent retry workflows",
          "Customer notification hooks",
          "Unified reconciliation",
        ],
        capabilities: [
          [
            "Mandate registration",
            "Initiate secure UPI AutoPay consent journeys with configurable amount and frequency controls.",
          ],
          [
            "Collection orchestration",
            "Run scheduled debits with idempotency, retry logic, and complete event visibility.",
          ],
          [
            "Real-time webhooks",
            "Keep every downstream system synchronized across mandate and payment state changes.",
          ],
          [
            "Operational controls",
            "Investigate exceptions, manage lifecycle actions, and export audit-ready records.",
          ],
        ],
        steps: [
          [
            "Create consent",
            "Generate a mandate request with customer, amount, and frequency parameters.",
          ],
          [
            "Customer approves",
            "The customer authorizes through their supported UPI application.",
          ],
          [
            "Collect and reconcile",
            "FirstPay orchestrates collections and returns real-time status events.",
          ],
        ],
      }}
    />
  );
}
