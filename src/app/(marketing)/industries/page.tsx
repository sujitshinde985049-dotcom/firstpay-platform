import {
  Building2,
  GraduationCap,
  HeartPulse,
  Landmark,
  LineChart,
  ShoppingBag,
} from "lucide-react";
import { FinalCta } from "@/components/marketing/home-sections";
import { PageHero } from "@/components/marketing/page-hero";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Industries",
  "Recurring payment infrastructure tailored for financial services, healthcare, education, SaaS, commerce, and consumer finance.",
  "/industries",
);
const sectors = [
  [
    Landmark,
    "Financial services",
    "Automate loan repayments, investment plans, and insurance premiums with controlled mandate operations.",
  ],
  [
    HeartPulse,
    "Healthcare",
    "Power memberships, care plans, and recurring diagnostic programs with customer-friendly payments.",
  ],
  [
    GraduationCap,
    "Education",
    "Collect tuition, course, and subscription fees on predictable schedules.",
  ],
  [
    Building2,
    "B2B SaaS",
    "Connect subscription billing to recurring collection rails and revenue operations.",
  ],
  [
    ShoppingBag,
    "Commerce",
    "Build memberships and high-retention recurring purchase experiences.",
  ],
  [
    LineChart,
    "Consumer finance",
    "Orchestrate EMI and repayment journeys with clear exception visibility.",
  ],
] as const;
export default function IndustriesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Industries"
        title="Purpose-built for recurring business models"
        description="Flexible payment infrastructure shaped around regulated workflows, customer trust, and high-volume operations."
      />
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {sectors.map(([Icon, title, detail]) => (
            <article key={title} className="bg-surface rounded-2xl border p-7">
              <Icon className="text-brand size-7" />
              <h2 className="mt-7 text-xl font-semibold">{title}</h2>
              <p className="text-muted mt-3 leading-7">{detail}</p>
              <p className="text-brand mt-6 text-sm font-semibold">
                Explore your use case →
              </p>
            </article>
          ))}
        </div>
      </section>
      <FinalCta />
    </main>
  );
}
