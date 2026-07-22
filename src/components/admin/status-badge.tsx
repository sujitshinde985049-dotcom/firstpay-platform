export function StatusBadge({ value }: { value: string }) {
  const tone =
    value === "active" || value === "published" || value === "resolved"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : value === "suspended" || value === "critical" || value === "urgent"
        ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
        : value === "trial" || value === "pending" || value === "scheduled"
          ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
