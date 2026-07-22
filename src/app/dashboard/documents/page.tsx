import { FolderPlus, Upload } from "lucide-react";
import { SettingsPanel } from "@/components/dashboard/settings-panel";
export default function Page() {
  return (
    <SettingsPanel
      title="Documents"
      description="Private organisation files in tenant-isolated Supabase Storage."
      sections={[
        {
          title: "Upload documents",
          body: "PDF, image, CSV, and Excel files up to 25 MB are validated and stored below the organisation UUID path.",
          action: (
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">
              <Upload className="mr-2 inline size-4" />
              Upload
            </button>
          ),
        },
        {
          title: "Folders",
          body: "Organise compliance, mandates, settlements, and operational files with nested folders.",
          action: (
            <button className="rounded-lg border px-4 py-2 text-sm">
              <FolderPlus className="mr-2 inline size-4" />
              New folder
            </button>
          ),
        },
        {
          title: "Secure preview",
          body: "Signed, short-lived URLs enable preview while RLS and Storage policies prevent cross-tenant access.",
        },
      ]}
    />
  );
}
