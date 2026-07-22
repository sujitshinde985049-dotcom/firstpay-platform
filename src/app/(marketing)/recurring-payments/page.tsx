import { ProductPage } from "@/components/marketing/product-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Recurring Payments",
  "Orchestrate recurring collections across UPI AutoPay and e-NACH from one platform.",
  "/recurring-payments",
);
export default function RecurringPaymentsPage() {
  return (
    <ProductPage
      content={{
        eyebrow: "Recurring payments",
        title: "One orchestration layer for every recurring revenue motion",
        description:
          "Unify schedules, retries, customer communications, payment events, and reconciliation across supported mandate rails.",
        outcomes: [
          "Multi-rail orchestration",
          "Flexible schedules",
          "Smart retry policies",
          "Revenue visibility",
          "Lower operational effort",
          "Consistent customer journeys",
        ],
        capabilities: [
          [
            "Subscription schedules",
            "Model fixed, variable, and custom recurring payment cycles.",
          ],
          [
            "Recovery automation",
            "Create controlled retry strategies around payment and mandate outcomes.",
          ],
          [
            "Revenue events",
            "Feed trusted collection data to billing, ledger, and customer systems.",
          ],
          [
            "Portfolio intelligence",
            "Monitor success trends, mandate health, and collection performance.",
          ],
        ],
        steps: [
          [
            "Configure",
            "Define the collection model, rail, amount rules, and schedule.",
          ],
          [
            "Orchestrate",
            "FirstPay manages payment instructions, events, and recovery actions.",
          ],
          [
            "Optimize",
            "Use portfolio insights to improve success and customer retention.",
          ],
        ],
      }}
    />
  );
}
