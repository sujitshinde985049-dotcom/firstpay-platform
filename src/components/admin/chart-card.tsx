import type { ReactNode } from "react";

export function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h2 className="font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function BarChart({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <div className="flex h-48 items-end gap-2" aria-label="Bar chart">
      {data.map((item) => (
        <div
          key={item.label}
          className="flex flex-1 flex-col items-center gap-2"
        >
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-blue-700 to-cyan-400"
            style={{ height: `${Math.max(6, (item.value / max) * 150)}px` }}
            title={`${item.label}: ${item.value}`}
          />
          <span className="text-[10px] text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const total = Math.max(
    1,
    data.reduce((sum, item) => sum + item.value, 0),
  );
  const colors = ["#155eef", "#12b76a", "#f79009", "#7a5af8", "#06aed4"];
  const stops = data
    .map((item, index) => {
      const start =
        (data.slice(0, index).reduce((sum, entry) => sum + entry.value, 0) /
          total) *
        100;
      const end = start + (item.value / total) * 100;
      return `${colors[index % colors.length]} ${start}% ${end}%`;
    })
    .join(",");
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[150px_1fr]">
      <div
        className="relative mx-auto size-36 rounded-full"
        style={{ background: `conic-gradient(${stops || "#e2e8f0 0 100%"})` }}
      >
        <div className="absolute inset-6 grid place-items-center rounded-full bg-white text-center dark:bg-slate-950">
          <span>
            <strong className="block text-2xl">{total}</strong>
            <small className="text-slate-500">clients</small>
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: colors[index % colors.length] }}
              />
              {item.name}
            </span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
