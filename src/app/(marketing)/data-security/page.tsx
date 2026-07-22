import {
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Radar,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { FinalCta } from "@/components/marketing/home-sections";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Data Security",
  "Learn about FirstPay's layered approach to application, infrastructure, identity, and tenant data security.",
  "/data-security",
);
const controls = [
  [
    LockKeyhole,
    "Data protection",
    "Encrypted transport, protected secret handling, and disciplined data minimization.",
  ],
  [
    UsersRound,
    "Access governance",
    "Organisation isolation, role-based access, and least-privilege administrative workflows.",
  ],
  [
    Fingerprint,
    "Identity security",
    "Secure session handling, invitation-only access, and support for strong authentication controls.",
  ],
  [
    Radar,
    "Monitoring",
    "Operational telemetry, audit trails, security review, and incident response practices.",
  ],
  [
    KeyRound,
    "API security",
    "Scoped credentials, idempotent writes, webhook signatures, and controlled key rotation.",
  ],
  [
    ShieldCheck,
    "Secure development",
    "Dependency review, validation pipelines, environment separation, and change controls.",
  ],
] as const;
export default function DataSecurityPage() {
  return (
    <main>
      <PageHero
        eyebrow="Security"
        title="A layered security model for payment infrastructure"
        description="FirstPay is engineered around tenant isolation, controlled access, secure integration patterns, and operational accountability."
        primary="Contact security"
        primaryHref="mailto:security@firstpay.in"
      />
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Security architecture"
            title="Controls across identity, application, data, and operations"
            description="Security is a continuous operating discipline built into how the platform is designed and managed."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {controls.map(([Icon, title, detail]) => (
              <article
                key={title}
                className="bg-surface rounded-2xl border p-7"
              >
                <Icon className="text-brand size-7" />
                <h2 className="mt-6 text-xl font-semibold">{title}</h2>
                <p className="text-muted mt-3 leading-7">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#071126] py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold tracking-widest text-cyan-300 uppercase">
              Shared responsibility
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Security works best as a partnership
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-400">
              FirstPay secures the platform while customers protect credentials,
              configure roles, validate webhooks, and operate according to their
              regulatory obligations.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h3 className="font-semibold">Report a security concern</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Send responsible disclosure details privately. Do not include
              credentials or customer data.
            </p>
            <a
              href="mailto:security@firstpay.in"
              className="mt-5 inline-block text-sm font-semibold text-cyan-300"
            >
              security@firstpay.in →
            </a>
          </div>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}
