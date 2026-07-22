import { LegalPage } from "@/components/marketing/legal-page";
import { privacySections } from "@/content/legal";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata(
  "Privacy Policy",
  "How FirstPay collects, uses, protects, and manages personal information.",
  "/privacy",
);
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains how FirstPay handles information across our website and services."
      sections={privacySections}
    />
  );
}
