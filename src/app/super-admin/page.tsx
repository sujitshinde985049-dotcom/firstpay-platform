import {
  Activity,
  Building2,
  Database,
  FileClock,
  Headphones,
  KeyRound,
  Target,
  ServerCog,
  ShieldAlert,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { BarChart, ChartCard, DonutChart } from "@/components/admin/chart-card";
import { MetricCard } from "@/components/admin/metric-card";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { getAdminDashboardData } from "@/lib/admin/data";

export default async function SuperAdminPage() {
  const data = await getAdminDashboardData();
  const m = data.metrics;
  const metrics = [
    ["Total clients", m.totalClients, "All tenant accounts", Building2, "blue"],
    [
      "Active clients",
      m.activeClients,
      "Currently operating",
      UserCheck,
      "green",
    ],
    ["Trial clients", m.trialClients, "Within trial period", Activity, "amber"],
    [
      "Suspended clients",
      m.suspendedClients,
      "Access restricted",
      UserX,
      "red",
    ],
    ["Total users", m.totalUsers, "Across the platform", Users, "blue"],
    [
      "Monthly active",
      m.monthlyActiveClients,
      "Active client accounts",
      KeyRound,
      "green",
    ],
    ["New clients", m.newClients, "Created this month", Building2, "blue"],
    ["Total leads", m.totalLeads, "Pipeline records", Target, "amber"],
    [
      "API usage",
      m.apiUsage.toLocaleString(),
      "Requests in 30 days",
      ServerCog,
      "blue",
    ],
    [
      "Storage usage",
      `${(m.storageUsage / 1073741824).toFixed(1)} GB`,
      "Latest tenant usage",
      Database,
      "green",
    ],
    [
      "Support tickets",
      m.supportTickets,
      "Open and pending",
      Headphones,
      "amber",
    ],
    [
      "Audit events",
      m.auditEvents,
      "Recent security events",
      ShieldAlert,
      "red",
    ],
  ] as const;
  return (
    <div>
      <PageHeader
        title="Platform command centre"
        description="Monitor client growth, usage, support, security, and adoption across FirstPay."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, detail, icon, tone]) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            detail={detail}
            icon={icon}
            tone={tone}
          />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Client growth"
          description="Eight-week client portfolio trend"
        >
          <BarChart data={data.growth} />
        </ChartCard>
        <ChartCard
          title="Plan distribution"
          description="Active clients by subscription tier"
        >
          <DonutChart data={data.planDistribution} />
        </ChartCard>
        <ChartCard
          title="Usage trends"
          description="API request volume over the last 30 days"
        >
          <BarChart
            data={data.usage.slice(-10).map((item) => ({
              label: String(item.usage_date).slice(5),
              value: Number(item.request_count),
            }))}
          />
        </ChartCard>
        <ChartCard
          title="Feature adoption"
          description="Enabled enterprise capabilities"
        >
          <BarChart
            data={[
              { label: "UPI", value: 82 },
              { label: "e-NACH", value: 67 },
              { label: "API", value: 91 },
              { label: "Reports", value: 58 },
              { label: "CMS", value: 31 },
            ]}
          />
        </ChartCard>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
          <h2 className="font-semibold">Recent activity</h2>
          <div className="mt-5 divide-y">
            {data.activity.length ? (
              data.activity.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <span>
                    <strong className="block font-medium">
                      {event.action}
                    </strong>
                    <small className="text-slate-500">
                      {event.entity_type} ·{" "}
                      {new Date(event.created_at).toLocaleString()}
                    </small>
                  </span>
                  <StatusBadge value={event.severity} />
                </div>
              ))
            ) : (
              <Empty label="No audit activity yet" />
            )}
          </div>
        </section>
        <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
          <h2 className="font-semibold">Support tickets</h2>
          <div className="mt-5 divide-y">
            {data.tickets.length ? (
              data.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <span>
                    <strong className="block font-medium">
                      {ticket.subject}
                    </strong>
                    <small className="text-slate-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </small>
                  </span>
                  <StatusBadge value={ticket.priority} />
                </div>
              ))
            ) : (
              <Empty label="No support tickets" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
function Empty({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-8 text-sm text-slate-500">
      <FileClock className="size-5" />
      {label}
    </div>
  );
}
