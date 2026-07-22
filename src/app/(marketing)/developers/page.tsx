import {
  BookOpen,
  Boxes,
  Braces,
  CheckCircle2,
  TerminalSquare,
  Webhook,
} from "lucide-react";
import { FinalCta } from "@/components/marketing/home-sections";
import { PageHero } from "@/components/marketing/page-hero";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Developers",
  "Integrate FirstPay recurring payment and mandate APIs with predictable resources, webhooks, and sandbox tooling.",
  "/developers",
);
const pillars = [
  [
    Braces,
    "Consistent APIs",
    "Resource-oriented endpoints, idempotency, and structured error responses.",
  ],
  [
    Webhook,
    "Signed webhooks",
    "Event delivery with signature verification, retries, and event history.",
  ],
  [
    Boxes,
    "Sandbox workflows",
    "Test mandate and payment states before controlled production onboarding.",
  ],
  [
    BookOpen,
    "Clear documentation",
    "Guides, references, examples, and operational integration patterns.",
  ],
] as const;
export default function DevelopersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Developer platform"
        title="A payment API designed for builders"
        description="Move from first request to production with predictable primitives, trusted events, and operational clarity."
        primary="Request sandbox access"
      />
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map(([Icon, title, detail]) => (
              <article
                key={title}
                className="bg-surface rounded-2xl border p-6"
              >
                <Icon className="text-brand size-6" />
                <h2 className="mt-6 text-lg font-semibold">{title}</h2>
                <p className="text-muted mt-3 text-sm leading-6">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#071126] py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <TerminalSquare className="size-8 text-cyan-300" />
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              From zero to mandate in one clear request
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-400">
              Use familiar JSON APIs and subscribe to lifecycle events without
              building brittle polling systems.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Test credentials and isolated sandbox",
                "Idempotent write operations",
                "Versioned API contracts",
                "Request IDs for support and tracing",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="size-5 text-emerald-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0b172d] p-6 text-sm leading-7 text-slate-300">
            <code>
              curl https://api.firstpay.in/v1/mandates \\{"\n"} -H{" "}
              <span className="text-emerald-300">
                &quot;Authorization: Bearer $KEY&quot;
              </span>{" "}
              \\{"\n"} -H{" "}
              <span className="text-emerald-300">
                &quot;Idempotency-Key: req_2026_01&quot;
              </span>{" "}
              \\{"\n"} -d{" "}
              <span className="text-emerald-300">
                &apos;{`{`}
                {"\n"} &quot;rail&quot;: &quot;upi_autopay&quot;,{"\n"}{" "}
                &quot;amount&quot;: 49900,{"\n"} &quot;frequency&quot;:
                &quot;monthly&quot;{"\n"} {`}`}&apos;
              </span>
            </code>
          </pre>
        </div>
      </section>
      <FinalCta />
    </main>
  );
}
