import { LegalPage } from "@/components/marketing/legal-page";
import { refundSections } from "@/content/legal";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata(
  "Refund Policy",
  "How refunds are handled across FirstPay-enabled payment experiences.",
  "/refund-policy",
);
export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      description="Information about merchant refunds, processing, and support responsibilities."
      sections={refundSections}
    />
  );
}
