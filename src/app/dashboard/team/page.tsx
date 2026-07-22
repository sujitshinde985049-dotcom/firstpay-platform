import { SettingsPanel } from "@/components/dashboard/settings-panel";
export default function Page() {
  return (
    <SettingsPanel
      title="Team management"
      description="Invite users and govern access by role, permission, and department."
      sections={[
        {
          title: "Invite user",
          body: "Send a time-limited Supabase Auth invitation without public signup.",
          action: (
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">
              Invite user
            </button>
          ),
        },
        {
          title: "Roles & permissions",
          body: "Assign Admin, Manager, Sales, Support, Finance, Developer, or Viewer roles. Server-side permission checks remain authoritative.",
        },
        {
          title: "Departments",
          body: "Group members by Finance, Sales, Support, Engineering, or custom departments.",
        },
        {
          title: "Lifecycle",
          body: "Deactivate access immediately while retaining audit history and profile attribution.",
        },
      ]}
    />
  );
}
