import { PageHero } from "@/components/marketing/page-hero";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "FAQ",
  "Answers about FirstPay products, integrations, mandates, security, and enterprise onboarding.",
  "/faq",
);
const categories = [
  {
    title: "Platform",
    items: [
      [
        "What does FirstPay provide?",
        "FirstPay provides enterprise infrastructure for recurring payments, UPI AutoPay, e-NACH, mandate lifecycle operations, and reconciliation.",
      ],
      [
        "Who is FirstPay built for?",
        "FirstPay is designed for businesses with recurring collection models and teams that require strong operational visibility and control.",
      ],
      [
        "Can we use multiple payment rails?",
        "Yes. The platform is designed to provide a unified operating model across supported recurring payment rails.",
      ],
    ],
  },
  {
    title: "Integration",
    items: [
      [
        "Is there a sandbox?",
        "Yes. Approved teams receive isolated credentials and test workflows before production onboarding.",
      ],
      [
        "How are updates delivered?",
        "Lifecycle changes are available through signed webhooks and queryable API resources.",
      ],
      [
        "Does FirstPay support idempotency?",
        "Write operations are designed around idempotent request patterns to make retries safe.",
      ],
    ],
  },
  {
    title: "Security and operations",
    items: [
      [
        "How is tenant data isolated?",
        "Organisation-scoped authorization and database policies enforce access boundaries between customers.",
      ],
      [
        "Can access be restricted by role?",
        "Yes. Platform and organisation roles support permission-based access for administrators, finance, operations, support, developers, and viewers.",
      ],
      [
        "Where can I view availability?",
        "The System Status page provides a current overview of FirstPay service components.",
      ],
    ],
  },
] as const;
export default function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="Help centre"
        title="Frequently asked questions"
        description="Straightforward answers about the FirstPay platform, integration model, and enterprise operations."
      />
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-6 sm:py-28">
        {categories.map((category) => (
          <div
            key={category.title}
            className="mb-12 grid gap-6 md:grid-cols-[220px_1fr]"
          >
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <div className="bg-surface divide-y rounded-2xl border px-6">
              {category.items.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="cursor-pointer list-none font-semibold">
                    {question}
                    <span className="text-brand float-right group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-muted pt-3 leading-7">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
