import { LegalPage } from "@/components/marketing/legal-page";
import { termsSections } from "@/content/legal";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata = createPageMetadata(
  "Terms of Service",
  "Terms governing access to and use of FirstPay services.",
  "/terms",
);
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms provide a general framework for accessing FirstPay services."
      sections={termsSections}
    />
  );
}
