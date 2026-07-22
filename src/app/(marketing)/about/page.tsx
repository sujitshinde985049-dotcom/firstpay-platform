import { Globe2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { FinalCta } from "@/components/marketing/home-sections";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "About",
  "FirstPay is building trusted recurring payment infrastructure for ambitious businesses in India.",
  "/about",
);
const values = [
  [ShieldCheck, "Trust by design"],
  [Sparkles, "Clarity over complexity"],
  [Users, "Customer outcomes"],
  [Globe2, "Built for India"],
] as const;

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About FirstPay"
        title="Building the trusted layer for recurring commerce"
        description="We believe payment infrastructure should give businesses more confidence, customers more clarity, and developers better primitives."
        primary="Meet our team"
      />
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <SectionHeading
            eyebrow="Our mission"
            title="Make recurring payments reliable, visible, and easy to operate"
            description="FirstPay brings mandates, collections, developer workflows, and operational intelligence into one secure enterprise platform."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map(([Icon, title]) => (
              <div key={title} className="bg-surface rounded-2xl border p-6">
                <Icon className="text-brand size-6" />
                <h2 className="mt-5 font-semibold">{title}</h2>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How we work"
            title="Enterprise discipline. Startup momentum."
            description="We pair careful infrastructure engineering with a bias for useful, measurable customer outcomes."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Own the outcome",
                "We work backward from customer and operational impact.",
              ],
              [
                "02",
                "Earn trust daily",
                "We communicate clearly and design for security from the start.",
              ],
              [
                "03",
                "Build for endurance",
                "We favor resilient systems and long-term product quality.",
              ],
            ].map(([number, title, detail]) => (
              <article
                key={number}
                className="bg-surface rounded-2xl border p-7"
              >
                <span className="text-brand text-sm font-bold">{number}</span>
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <p className="text-muted mt-3 leading-7">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}
