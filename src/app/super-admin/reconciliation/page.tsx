import { FileSearch, FileUp, Scale, ShieldCheck } from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Reconciliation"
      description="Compare immutable internal records with provider reports and settlements."
      cards={[
        {
          title: "Differences",
          description:
            "Missing records, amount, status, duplicate reference, and settlement mismatches.",
          icon: Scale,
        },
        {
          title: "CSV import",
          description:
            "Validated import placeholder where provider APIs are unavailable.",
          icon: FileUp,
        },
        {
          title: "Manual review",
          description:
            "Assigned review state and resolution notes with attribution.",
          icon: FileSearch,
        },
        {
          title: "Financial integrity",
          description:
            "No reconciliation workflow silently modifies a financial record.",
          icon: ShieldCheck,
        },
      ]}
    />
  );
}
