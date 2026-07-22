import { SettingsPanel } from "@/components/dashboard/settings-panel";
const types = [
  "Collections",
  "Mandates",
  "Payments",
  "Settlements",
  "Leads",
  "Users",
];
export default function Page() {
  return (
    <SettingsPanel
      title="Reports"
      description="Generate tenant-scoped operational reports."
      sections={types.map((title) => ({
        title,
        body: `Download ${title.toLowerCase()} data for reconciliation and analysis. CSV is available now; Excel export is prepared as a controlled placeholder.`,
        action: (
          <div className="flex gap-2">
            <a
              href={`/dashboard/reports/export?type=${title.toLowerCase()}`}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Export CSV
            </a>
            <button
              disabled
              className="rounded-lg border px-4 py-2 text-sm opacity-50"
            >
              Excel (coming soon)
            </button>
          </div>
        ),
      }))}
    />
  );
}
