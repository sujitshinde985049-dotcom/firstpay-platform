export default function SuperAdminLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading administration portal</span>
      <div className="h-9 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border bg-slate-100 dark:bg-slate-900"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl border bg-slate-100 dark:bg-slate-900" />
    </div>
  );
}
