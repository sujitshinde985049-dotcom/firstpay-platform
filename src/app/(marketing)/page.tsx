import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import {
  DeveloperSection,
  FeatureSections,
  FinalCta,
  SecurityTestimonialsFaq,
  Stats,
  TimelineSection,
  TrustBand,
} from "@/components/marketing/home-sections";
import { Reveal } from "@/components/marketing/reveal";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FirstPay",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    description:
      "Enterprise recurring payment and digital mandate infrastructure.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "enterprise@firstpay.in",
    },
  };
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden pt-14 pb-18 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="marketing-grid absolute inset-0 -z-10 opacity-70" />
        <div className="absolute top-0 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <span className="bg-surface/80 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm">
                <BadgeCheck className="text-accent size-4" /> Enterprise payment
                infrastructure for India
              </span>
              <h1 className="mt-7 text-4xl font-bold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
                Recurring payments.
                <br />
                <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">
                  Built for confident scale.
                </span>
              </h1>
              <p className="text-muted mx-auto mt-7 max-w-2xl text-lg leading-8 sm:text-xl">
                One secure platform to create mandates, collect payments,
                orchestrate retries, and reconcile every transaction.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="bg-brand inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5"
                >
                  Talk to sales <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/developers"
                  className="bg-surface rounded-xl border px-6 py-3.5 text-sm font-semibold shadow-sm"
                >
                  Explore developer platform
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal className="mx-auto mt-14 max-w-6xl" delay={0.15}>
            <DashboardPreview />
          </Reveal>
        </div>
      </section>
      <TrustBand />
      <Stats />
      <FeatureSections />
      <TimelineSection />
      <DeveloperSection />
      <SecurityTestimonialsFaq />
      <FinalCta />
    </main>
  );
}
