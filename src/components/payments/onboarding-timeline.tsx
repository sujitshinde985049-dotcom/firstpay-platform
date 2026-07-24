import {
  CheckCircle2,
  Clock3,
  FileLock2,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
const steps = [
  "Organisation created",
  "Business profile completed",
  "KYC documents uploaded",
  "Bank information placeholder submitted",
  "Providers selected",
  "Provider application created",
  "Internal review",
  "Additional information requested",
  "Provider review",
  "Sandbox approved",
  "Production credentials pending",
  "Live approved",
];
export function OnboardingTimeline({ admin = false }: { admin?: boolean }) {
  return (
    <div>
      <PageHeader
        title={admin ? "Merchant onboarding" : "Merchant onboarding status"}
        description="A controlled workflow from business profile through sandbox and explicit live approval."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <ol className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
          {steps.map((s, i) => (
            <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 dark:bg-blue-950">
                {i + 1}
              </span>
              <div>
                <strong className="text-sm">{s}</strong>
                <p className="mt-1 text-xs text-slate-500">
                  Pending verified evidence and authorised review.
                </p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="space-y-4">
          <section className="rounded-2xl border bg-white p-5 dark:bg-slate-950">
            <FileLock2 className="size-5 text-blue-700" />
            <h2 className="mt-3 font-semibold">Sensitive-data boundary</h2>
            <p className="mt-2 text-sm text-slate-500">
              Bank and identity values remain placeholders until encryption,
              legal basis, retention, and access controls are approved.
            </p>
          </section>
          {[
            { i: ShieldCheck, t: "Internal review" },
            { i: Clock3, t: "Provider review" },
            { i: Landmark, t: "Live approval" },
            { i: CheckCircle2, t: "Audit history" },
          ].map((x) => (
            <div
              key={x.t}
              className="flex items-center gap-3 rounded-xl border bg-white p-4 text-sm font-medium dark:bg-slate-950"
            >
              <x.i className="size-4 text-blue-700" />
              {x.t}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
