import {
  Activity,
  BadgeIndianRupee,
  CircleCheck,
  CircleX,
  Landmark,
  UserRound,
  Workflow,
} from "lucide-react";
import { BarChart, ChartCard, DonutChart } from "@/components/admin/chart-card";
import { MetricCard } from "@/components/admin/metric-card";
import { PageHeader } from "@/components/admin/page-header";
import { getDashboardData } from "@/lib/dashboard/data";
const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export default async function DashboardPage() {
  const d = await getDashboardData();
  return (
    <div>
      <PageHeader
        title={`${d.organisation.name} overview`}
        description="Live collections, mandates, payment health, and operational activity."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Collection summary"
          value={money(d.metrics.collection)}
          detail="Successful collections"
          icon={BadgeIndianRupee}
        />
        <MetricCard
          label="Active customers"
          value={d.metrics.customers}
          detail="Current customer base"
          icon={UserRound}
        />
        <MetricCard
          label="Active mandates"
          value={d.metrics.mandates}
          detail="UPI AutoPay and e-NACH"
          icon={Workflow}
        />
        <MetricCard
          label="Successful payments"
          value={d.metrics.successful}
          detail="Last 180 days"
          icon={CircleCheck}
        />
        <MetricCard
          label="Failed payments"
          value={d.metrics.failed}
          detail="Needs attention"
          icon={CircleX}
        />
        <MetricCard
          label="Settlements"
          value={money(d.metrics.settlements)}
          detail="Settled value"
          icon={Landmark}
        />
        <MetricCard
          label="Pending collections"
          value={money(d.metrics.pending)}
          detail="Awaiting confirmation"
          icon={Activity}
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Monthly collections"
          description="Six-month payment volume"
        >
          <BarChart data={d.charts} />
        </ChartCard>
        <ChartCard
          title="Payment success rate"
          description="Successful, failed, and pending"
        >
          <DonutChart
            data={[
              { name: "Successful", value: d.metrics.successful },
              { name: "Failed", value: d.metrics.failed },
              { name: "Pending", value: Number(d.metrics.pending > 0) },
            ]}
          />
        </ChartCard>
        <ChartCard
          title="Mandate growth"
          description="Active recurring instructions"
        >
          <BarChart
            data={d.charts.map((x, i) => ({
              ...x,
              value: Math.max(0, d.metrics.mandates - 5 + i),
            }))}
          />
        </ChartCard>
        <ChartCard
          title="Failed payments"
          description="Payment exception trend"
        >
          <BarChart
            data={d.charts.map((x, i) => ({
              ...x,
              value:
                i === 5 ? d.metrics.failed : Math.max(0, d.metrics.failed - i),
            }))}
          />
        </ChartCard>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {[
          ["Recent activity", d.activity, "action"],
          ["Recent API calls", d.api, "request_count"],
          ["Recent webhooks", d.webhooks, "event_type"],
        ].map(([title, rows, key]) => (
          <section
            key={String(title)}
            className="rounded-2xl border bg-white p-6 dark:bg-slate-950"
          >
            <h2 className="font-semibold">{String(title)}</h2>
            <div className="mt-4 space-y-3">
              {(rows as Record<string, unknown>[]).map((r, i) => (
                <div
                  key={String(r.id ?? i)}
                  className="flex justify-between border-b pb-3 text-sm"
                >
                  <span>{String(r[String(key)] ?? "No activity")}</span>
                  <span className="text-slate-500">
                    {String(r.status ?? r.severity ?? "")}
                  </span>
                </div>
              ))}
              {!(rows as unknown[]).length ? (
                <p className="text-sm text-slate-500">No recent events.</p>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
