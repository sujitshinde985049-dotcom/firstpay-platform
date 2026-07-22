import { ProductPage } from "@/components/marketing/product-page";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Mandate Management",
  "Operate the full digital mandate lifecycle from one secure FirstPay control plane.",
  "/mandate-management",
);
export default function MandateManagementPage() {
  return (
    <ProductPage
      content={{
        eyebrow: "Mandate management",
        title: "Every mandate. One operational control plane.",
        description:
          "Register, monitor, amend, pause, revoke, and investigate mandates across rails with complete lifecycle context.",
        outcomes: [
          "Unified mandate inventory",
          "Searchable lifecycle history",
          "Bulk operations",
          "Role-based controls",
          "Exception queues",
          "Audit-ready exports",
        ],
        capabilities: [
          [
            "Portfolio control",
            "Manage active, pending, paused, and revoked mandates from one workspace.",
          ],
          [
            "Lifecycle intelligence",
            "Understand every state transition and related customer action.",
          ],
          [
            "Bulk workflows",
            "Operate safely at volume with validated imports and controlled actions.",
          ],
          [
            "Governed access",
            "Separate responsibilities across operations, support, finance, and developers.",
          ],
        ],
        steps: [
          [
            "Ingest",
            "Create mandates through APIs or approved operational workflows.",
          ],
          [
            "Monitor",
            "Track health, exceptions, and customer actions in real time.",
          ],
          [
            "Act",
            "Run permissioned lifecycle actions with complete audit context.",
          ],
        ],
      }}
    />
  );
}
