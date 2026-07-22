import { FileCheck2, FileUp, ScanSearch, ShieldCheck } from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="KYC documents"
      description="Private, organisation-isolated onboarding evidence."
      cards={[
        {
          title: "Upload",
          description:
            "PDF, JPEG, PNG, or WebP up to 10 MB in a private Supabase bucket.",
          icon: FileUp,
        },
        {
          title: "Document types",
          description:
            "Registration, PAN, GST, address, bank, signatory, board resolution, and provider-specific evidence.",
          icon: FileCheck2,
        },
        {
          title: "Review",
          description:
            "Pending, approved, rejected, or expired with safe rejection reason.",
          icon: ShieldCheck,
        },
        {
          title: "Malware scanning",
          description:
            "Production activation is blocked until the scanning placeholder is replaced by an approved service.",
          icon: ScanSearch,
        },
      ]}
    />
  );
}
