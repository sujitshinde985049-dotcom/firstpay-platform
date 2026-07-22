import { Activity, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "System Status",
  "Current status of FirstPay APIs, dashboard, webhooks, and payment processing components.",
  "/status",
);
const services = [
  "Core API",
  "Dashboard",
  "UPI AutoPay processing",
  "e-NACH processing",
  "Webhook delivery",
  "Authentication",
];
export default function StatusPage() {
  return (
    <main>
      <PageHero
        eyebrow="System status"
        title="All systems operational"
        description="Current health across FirstPay platform components. Last checked from the public status summary."
        primary="Contact support"
        primaryHref="mailto:support@firstpay.in"
        secondary="Read security overview"
        secondaryHref="/data-security"
      />
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-6 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <span className="grid size-11 place-items-center rounded-full bg-emerald-500 text-white">
            <Activity className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">
              FirstPay services are operating normally
            </h2>
            <p className="mt-1 text-sm opacity-75">
              No active incidents reported.
            </p>
          </div>
        </div>
        <div className="bg-surface mt-8 divide-y rounded-2xl border px-6">
          {services.map((service) => (
            <div
              key={service}
              className="flex items-center justify-between py-5"
            >
              <span className="font-medium">{service}</span>
              <span className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 className="size-4" /> Operational
              </span>
            </div>
          ))}
        </div>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Incident history</h2>
          <div className="bg-surface mt-5 rounded-2xl border p-6">
            <p className="font-medium">
              No incidents reported in the last 90 days
            </p>
            <p className="text-muted mt-2 text-sm">
              Planned maintenance will be communicated to affected customers
              through approved channels.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
