import {
  CheckCircle2,
  Code2,
  KeyRound,
  ShieldCheck,
  Webhook,
  Zap,
} from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
const sections = [
  {
    id: "authentication",
    title: "Authentication",
    icon: KeyRound,
    text: "Use a server-side API key in the Authorization header. Keys are shown once, stored as hashes, scoped, rotatable, and revocable.",
  },
  {
    id: "rest",
    title: "REST APIs",
    icon: Code2,
    text: "Versioned JSON endpoints are prepared for customers, mandates, payments, and settlements. No live payment execution is included.",
  },
  {
    id: "webhooks",
    title: "Webhook events",
    icon: Webhook,
    text: "Signed event envelopes cover mandate and payment lifecycle changes with idempotent retry guidance.",
  },
  {
    id: "errors",
    title: "Error codes",
    icon: ShieldCheck,
    text: "Consistent HTTP status codes and machine-readable error identifiers support safe recovery without leaking internals.",
  },
  {
    id: "versioning",
    title: "Versioning",
    icon: Zap,
    text: "Date-based API versions preserve compatibility, with explicit deprecation and migration windows.",
  },
  {
    id: "sandbox",
    title: "Sandbox & SDKs",
    icon: CheckCircle2,
    text: "Sandbox credentials and JavaScript, PHP, Java, Python, and .NET SDK adapters are documented placeholders.",
  },
];
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="FirstPay Developers"
        title="API documentation built for reliable recurring payments"
        description="Secure architecture, predictable contracts, and integration guidance for enterprise engineering teams."
      />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <nav
          aria-label="API documentation sections"
          className="mb-10 flex flex-wrap gap-2"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              {s.title}
            </a>
          ))}
        </nav>
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 rounded-2xl border bg-white p-7 shadow-sm dark:bg-slate-950"
            >
              <s.icon className="size-6 text-blue-700" />
              <h2 className="mt-5 text-xl font-semibold">{s.title}</h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                {s.text}
              </p>
              <pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-cyan-300">
                <code>
                  {s.id === "authentication"
                    ? "Authorization: Bearer fp_live_••••••••"
                    : "GET /v1/" + s.id}
                </code>
              </pre>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
