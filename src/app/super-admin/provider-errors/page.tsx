import { Bug, FileWarning, LockKeyhole, RefreshCcw } from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Provider errors"
      description="Sanitised provider errors and request diagnostics."
      cards={[
        {
          title: "Safe request logs",
          description: "Hashed requests and redacted metadata only.",
          icon: LockKeyhole,
        },
        {
          title: "Configuration errors",
          description:
            "Missing external references and environment mismatches.",
          icon: FileWarning,
        },
        {
          title: "Provider failures",
          description:
            "Normalised categories, codes, retry eligibility, and safe messages.",
          icon: Bug,
        },
        {
          title: "Retry review",
          description:
            "Bounded safe retries; financial debits never fail over implicitly.",
          icon: RefreshCcw,
        },
      ]}
    />
  );
}
