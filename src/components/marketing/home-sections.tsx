import {
  ArrowRight,
  Banknote,
  Blocks,
  Building2,
  Check,
  CircleDot,
  Code2,
  GraduationCap,
  HeartPulse,
  Landmark,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";

const features = [
  [
    RefreshCcw,
    "Recurring payment orchestration",
    "Create, schedule, retry, and reconcile payment cycles across rails from one control plane.",
  ],
  [
    Workflow,
    "Mandate lifecycle automation",
    "Track registration, amendments, revocations, and collections with real-time status intelligence.",
  ],
  [
    Blocks,
    "Composable payment APIs",
    "Launch faster with clean APIs, event-driven webhooks, SDKs, and a secure sandbox.",
  ],
  [
    ShieldCheck,
    "Enterprise-grade controls",
    "Granular roles, audit-ready operations, data isolation, and layered platform security.",
  ],
] as const;

const industries = [
  [Landmark, "Financial services", "Lending, wealth, insurance"],
  [HeartPulse, "Healthcare", "Plans, care, diagnostics"],
  [GraduationCap, "Education", "Fees and subscriptions"],
  [ShoppingBag, "Commerce", "Memberships and retention"],
  [Building2, "SaaS", "Usage and subscription billing"],
  [Banknote, "Consumer finance", "EMIs and repayments"],
] as const;

const faqs = [
  [
    "What payment rails does FirstPay support?",
    "FirstPay is designed for UPI AutoPay and e-NACH recurring collections, with a unified mandate and reconciliation layer.",
  ],
  [
    "Can FirstPay support high-volume mandate operations?",
    "Yes. The platform architecture supports bulk mandate workflows, event-driven updates, retry orchestration, and operational reporting.",
  ],
  [
    "How does FirstPay approach security?",
    "FirstPay uses layered access controls, tenant isolation, encrypted transport, audit-focused workflows, and secure infrastructure practices.",
  ],
  [
    "Is there a sandbox for developers?",
    "Yes. Teams can integrate against a sandbox, test mandate states and webhooks, and move through controlled production onboarding.",
  ],
] as const;

export function TrustBand() {
  return (
    <section className="bg-surface border-y py-9">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <p className="text-muted text-center text-xs font-bold tracking-[0.2em] uppercase">
          Infrastructure trusted by modern finance teams
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3 text-center sm:grid-cols-3 lg:grid-cols-6">
          {[
            "ALTURA",
            "NORTHSTAR",
            "MERIDIAN",
            "ASTER",
            "VANTAGE",
            "ORBITAL",
          ].map((name) => (
            <div
              key={name}
              className="bg-background text-muted rounded-xl border px-3 py-4 text-xs font-black tracking-[0.12em]"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="bg-ink py-14 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 sm:px-6 lg:grid-cols-4 lg:px-8">
        {[
          ["99.99%", "Platform availability target"],
          ["98.7%", "Payment success intelligence"],
          ["< 120ms", "Median API response target"],
          ["24×7", "Operations visibility"],
        ].map(([value, label]) => (
          <Reveal key={label}>
            <p className="text-3xl font-bold sm:text-4xl">{value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FeatureSections() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="One platform"
            title="Everything your recurring payments operation needs"
            description="A unified infrastructure layer for mandates, collections, intelligence, and developer velocity."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {features.map(([Icon, title, description], index) => (
              <Reveal
                key={title}
                delay={index * 0.05}
                className="bg-surface rounded-2xl border p-7 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-7 text-xl font-semibold">{title}</h3>
                <p className="text-muted mt-3 leading-7">{description}</p>
                <Link
                  href="/solutions"
                  className="text-brand mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                >
                  Explore capability <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Built for every sector"
            title="Payment journeys shaped around your business"
            description="Flexible infrastructure for regulated, high-volume, and customer-critical collection workflows."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map(([Icon, title, detail]) => (
              <Link
                key={title}
                href="/industries"
                className="group bg-surface hover:border-brand/40 rounded-2xl border p-6"
              >
                <Icon className="text-brand size-6" />
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="text-muted mt-2 text-sm">{detail}</p>
                <ArrowRight className="mt-5 size-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function TimelineSection() {
  const steps = [
    ["01", "Connect", "Integrate APIs and configure secure credentials."],
    ["02", "Register", "Create digital mandates across supported rails."],
    ["03", "Collect", "Automate schedules, retries, and notifications."],
    ["04", "Reconcile", "Close the loop with events and reporting."],
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="From integration to scale"
          title="Go live with a controlled, enterprise-ready path"
          description="A clear operating model designed for engineering, finance, risk, and support teams."
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-4">
          {steps.map(([number, title, detail]) => (
            <div
              key={number}
              className="border-brand/30 relative border-l-2 pl-6 lg:border-t-2 lg:border-l-0 lg:pt-7 lg:pl-0"
            >
              <span className="text-brand text-xs font-bold">{number}</span>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="text-muted mt-2 text-sm leading-6">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeveloperSection() {
  const example = `const mandate = await firstpay.mandates.create({
  customer_id: "cus_01HQ...",
  rail: "upi_autopay",
  amount: 49900,
  frequency: "monthly"
});`;

  return (
    <section className="bg-[#071126] py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-bold tracking-[0.18em] text-cyan-300 uppercase">
            Developer first
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            APIs your engineers will want to build with
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
            Predictable resources, idempotent requests, signed webhooks, clear
            errors, and observability built in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/developers"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Read developer docs
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold"
            >
              Get sandbox access
            </Link>
          </div>
        </div>
        <div className="enterprise-shadow overflow-hidden rounded-2xl border border-white/10 bg-[#0b172d]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 text-xs text-slate-500">
            <CircleDot className="size-3 text-emerald-400" /> create-mandate.ts
          </div>
          <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-300">
            <code>{example}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

export function SecurityTestimonialsFaq() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <LockKeyhole className="text-brand size-9" />
            <SectionHeading
              eyebrow="Security by design"
              title="Trust is built into every layer"
              description="Controls designed around the realities of payment operations, privileged access, and sensitive customer data."
            />
            <Link
              href="/data-security"
              className="text-brand mt-7 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Explore data security <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Role-based access controls",
              "Encrypted data in transit",
              "Tenant-level isolation",
              "Audit-ready operations",
              "Secure webhook signing",
              "Continuous monitoring",
            ].map((item) => (
              <div
                key={item}
                className="bg-surface flex gap-3 rounded-xl border p-4"
              >
                <Check className="text-accent mt-0.5 size-5 shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Customer outcomes"
            title="Built for teams that cannot compromise"
            description="A payment operating layer designed for reliability, visibility, and confident scale."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              [
                "FirstPay gave our finance and engineering teams one shared view of every mandate lifecycle.",
                "VP Finance",
                "Consumer lending",
              ],
              [
                "The integration model is clear, predictable, and built around how enterprise teams actually ship.",
                "Director of Engineering",
                "B2B SaaS",
              ],
              [
                "Real-time status and reconciliation transformed our recurring collection operations.",
                "Head of Operations",
                "Digital healthcare",
              ],
            ].map(([quote, person, company]) => (
              <blockquote
                key={company}
                className="bg-surface rounded-2xl border p-7"
              >
                <Sparkles className="text-brand size-5" />
                <p className="mt-5 text-lg leading-8">“{quote}”</p>
                <footer className="mt-6 text-sm">
                  <strong>{person}</strong>
                  <span className="text-muted block">{company}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <SectionHeading
            eyebrow="Frequently asked"
            title="Questions, answered"
            description="A quick view of FirstPay's platform and operating model."
            align="center"
          />
          <div className="bg-surface mt-10 divide-y rounded-2xl border px-6">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 font-semibold marker:hidden">
                  {question}
                  <span className="text-brand float-right transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-muted pt-3 leading-7">{answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/faq" className="text-brand text-sm font-semibold">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function FinalCta() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-800 to-cyan-900 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <div className="marketing-grid absolute inset-0 opacity-20" />
        <div className="relative">
          <Code2 className="mx-auto size-9 text-cyan-200" />
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            Move your recurring payment stack forward
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Talk to our enterprise team about your mandate, collection, and
            integration requirements.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-900"
            >
              Talk to sales
            </Link>
            <Link
              href="/developers"
              className="rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold"
            >
              Explore APIs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
