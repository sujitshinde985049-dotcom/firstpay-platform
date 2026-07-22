import {
  Activity,
  CheckCircle2,
  FlaskConical,
  LockKeyhole,
  Route,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
const providers = [
  {
    key: "razorpay",
    name: "Razorpay",
    documented:
      "UPI AutoPay, recurring payments, payments, refunds, settlements, webhooks",
    sandbox: true,
  },
  {
    key: "phonepe",
    name: "PhonePe PG",
    documented:
      "Payment gateway placeholder; capabilities require merchant documentation review",
    sandbox: true,
  },
  {
    key: "cashfree",
    name: "Cashfree",
    documented:
      "Subscriptions, mandates, payments, refunds, settlements, signed webhooks",
    sandbox: true,
  },
  {
    key: "jio-pg",
    name: "Jio PG",
    documented:
      "Typed placeholder only; official technical specification required",
    sandbox: false,
  },
  {
    key: "sabpaisa",
    name: "SabPaisa",
    documented:
      "Typed placeholder only; official technical specification required",
    sandbox: false,
  },
];
export function ProviderCards({ client = false }: { client?: boolean }) {
  return (
    <div>
      <PageHeader
        title={
          client ? "Assigned payment providers" : "Payment provider registry"
        }
        description={
          client
            ? "View assigned providers and environment readiness without exposing credentials."
            : "Govern capability verification, organisation assignment, environment, health, and production eligibility."
        }
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {providers.map((p) => (
          <section
            key={p.key}
            className="rounded-2xl border bg-white p-6 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950">
                Not sandbox-tested
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {p.documented}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <span className="flex items-center gap-2">
                <FlaskConical className="size-4" />
                Sandbox {p.sandbox ? "documented" : "unverified"}
              </span>
              <span className="flex items-center gap-2">
                <LockKeyhole className="size-4" />
                Secrets masked
              </span>
              <span className="flex items-center gap-2">
                <Route className="size-4" />
                Routing prepared
              </span>
              <span className="flex items-center gap-2">
                <Activity className="size-4" />
                Health pending
              </span>
            </div>
            {client ? null : (
              <a
                href={`/super-admin/providers/${p.key}`}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
              >
                Review configuration <CheckCircle2 className="size-4" />
              </a>
            )}
          </section>
        ))}
      </div>
      <div className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900 dark:bg-red-950/30">
        <ShieldAlert className="size-5 shrink-0" />
        <p>
          Production activation is blocked until official documentation is
          reviewed, credentials are stored through an approved encryption
          service, sandbox tests pass, and a Super Admin records live approval.
        </p>
      </div>
    </div>
  );
}
