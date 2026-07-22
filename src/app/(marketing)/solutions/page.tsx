import {
  ArrowRight,
  BadgeIndianRupee,
  Braces,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { FinalCta } from "@/components/marketing/home-sections";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Solutions",
  "Explore FirstPay's enterprise payment, mandate, orchestration, and developer solutions.",
  "/solutions",
);
const solutions = [
  [
    BadgeIndianRupee,
    "Collect recurring payments",
    "Create customer-friendly recurring collections across UPI AutoPay and e-NACH.",
    "/recurring-payments",
  ],
  [
    ChartNoAxesCombined,
    "Operate every mandate",
    "Centralize mandate lifecycle visibility, actions, exceptions, and reporting.",
    "/mandate-management",
  ],
  [
    Braces,
    "Embed payment infrastructure",
    "Build using composable APIs, signed webhooks, and secure developer tooling.",
    "/developers",
  ],
  [
    ShieldCheck,
    "Strengthen control",
    "Apply enterprise access, audit, isolation, and security practices across payment operations.",
    "/data-security",
  ],
] as const;
export default function SolutionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="Payment infrastructure built around outcomes"
        description="Bring product, engineering, finance, and operations onto one secure platform for recurring collections."
      />
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Explore FirstPay"
            title="A connected platform for the complete payment lifecycle"
            description="Adopt the capabilities you need today and scale into a unified operating layer."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {solutions.map(([Icon, title, detail, href]) => (
              <Link
                key={href}
                href={href}
                className="group bg-surface hover:border-brand/40 rounded-2xl border p-8 hover:shadow-xl"
              >
                <Icon className="text-brand size-7" />
                <h2 className="mt-7 text-2xl font-semibold">{title}</h2>
                <p className="text-muted mt-3 leading-7">{detail}</p>
                <span className="text-brand mt-7 inline-flex items-center gap-2 text-sm font-semibold">
                  Learn more{" "}
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}
