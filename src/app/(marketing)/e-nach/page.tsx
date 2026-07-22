import { ProductPage } from "@/components/marketing/product-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "e-NACH",
  "Digitize bank-account mandate registration, recurring collections, and reconciliation with FirstPay e-NACH.",
  "/e-nach",
);
export default function ENachPage() {
  return (
    <ProductPage
      content={{
        eyebrow: "e-NACH",
        title: "Bank-account mandates, built for dependable scale",
        description:
          "Digitize mandate registration and recurring debit operations with transparent status, exception handling, and reconciliation.",
        outcomes: [
          "Digital mandate journeys",
          "Broad account reach",
          "High-value recurring debits",
          "Lifecycle status tracking",
          "Exception operations",
          "Reconciliation exports",
        ],
        capabilities: [
          [
            "Digital registration",
            "Guide customers through a clear bank-account mandate authorization experience.",
          ],
          [
            "Debit scheduling",
            "Configure recurring collection instructions with predictable processing controls.",
          ],
          [
            "Exception visibility",
            "Surface registration, debit, and return states to the teams that need them.",
          ],
          [
            "Secure operations",
            "Use granular access, audit histories, and protected workflows across teams.",
          ],
        ],
        steps: [
          [
            "Submit mandate",
            "Create the mandate with customer and collection parameters.",
          ],
          [
            "Authorize account",
            "The customer authenticates the mandate through the supported bank flow.",
          ],
          [
            "Run debits",
            "Schedule collections and reconcile outcomes through APIs and reports.",
          ],
        ],
      }}
    />
  );
}
