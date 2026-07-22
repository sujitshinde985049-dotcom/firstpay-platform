import { Check, Gauge, LockKeyhole, Network, Webhook } from "lucide-react";
import { FinalCta } from "@/components/marketing/home-sections";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";

export type ProductPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  outcomes: string[];
  capabilities: Array<[string, string]>;
  steps: Array<[string, string]>;
};

export function ProductPage({ content }: { content: ProductPageContent }) {
  const icons = [Network, Gauge, Webhook, LockKeyhole];
  return (
    <main>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <section className="py-18 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <SectionHeading
            eyebrow="Business outcomes"
            title="Designed for operational certainty"
            description="Launch and scale recurring collection experiences without compromising customer experience or control."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {content.outcomes.map((outcome) => (
              <div
                key={outcome}
                className="bg-surface flex gap-3 rounded-xl border p-4"
              >
                <Check className="text-accent size-5 shrink-0" />
                <span className="text-sm font-medium">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-18 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="One product. Complete lifecycle visibility."
            description="Purpose-built tools for engineering, finance, support, and operations teams."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {content.capabilities.map(([title, detail], index) => {
              const Icon = icons[index % icons.length];
              return (
                <article
                  key={title}
                  className="bg-surface rounded-2xl border p-7"
                >
                  <Icon className="text-brand size-6" />
                  <h2 className="mt-6 text-xl font-semibold">{title}</h2>
                  <p className="text-muted mt-3 leading-7">{detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-18 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="A clear path from consent to collection"
            description="Every stage is observable, programmable, and designed for audit-ready operations."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {content.steps.map(([title, detail], index) => (
              <article
                key={title}
                className="bg-surface rounded-2xl border p-7"
              >
                <span className="text-brand text-sm font-bold">
                  0{index + 1}
                </span>
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
