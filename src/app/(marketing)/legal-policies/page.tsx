import { PageHero } from "@/components/marketing/page-hero";
const policies = [
  "Privacy Policy",
  "Terms and Conditions",
  "Grievance Policy",
  "Refund Policy",
  "Data Security Policy",
  "Data Retention Policy",
  "Information Security Policy",
  "Incident Response Policy",
  "Vendor Management Policy",
  "Business Continuity Policy",
];
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Legal review workspace"
        title="Policies requiring owner and legal-adviser approval"
        description="These are editable content placeholders, not final legal advice, licences, approvals, or certifications."
      />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {policies.map((name) => (
            <section
              key={name}
              className="rounded-2xl border bg-white p-6 dark:bg-slate-950"
            >
              <h2 className="font-semibold">{name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                CONTENT REPLACEMENT REQUIRED: FirstPay owner and qualified legal
                adviser must approve jurisdiction, entities, processing
                purposes, rights, retention, grievance contacts, effective date,
                and version history before publication.
              </p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
