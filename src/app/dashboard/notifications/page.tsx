import { SettingsPanel } from "@/components/dashboard/settings-panel";
export default function Page() {
  return (
    <SettingsPanel
      title="Notification centre"
      description="Prioritised organisation and personal alerts."
      sections={[
        {
          title: "Unread",
          body: "Unread payment exceptions, webhook failures, mandate changes, and platform messages appear here.",
          action: (
            <button className="rounded-lg border px-4 py-2 text-sm">
              Mark all read
            </button>
          ),
        },
        {
          title: "Priority",
          body: "Critical alerts remain prominent until acknowledged; high, normal, and low priorities follow.",
        },
      ]}
    />
  );
}
