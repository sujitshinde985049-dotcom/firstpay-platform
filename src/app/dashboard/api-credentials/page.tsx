import { KeyRound, RotateCw, ShieldOff } from "lucide-react";
import { SettingsPanel } from "@/components/dashboard/settings-panel";
export default function Page() {
  return (
    <SettingsPanel
      title="API credentials"
      description="Create and govern keys without ever exposing stored secrets."
      sections={[
        {
          title: "Live credentials",
          body: "Only a key prefix and one-way secret hash are stored. A generated secret is displayed once, then cannot be retrieved.",
          action: (
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">
              <KeyRound className="mr-2 inline size-4" />
              Generate key
            </button>
          ),
        },
        {
          title: "Rotate safely",
          body: "Rotation issues a replacement credential before revoking the previous key.",
          action: (
            <button className="rounded-lg border px-4 py-2 text-sm">
              <RotateCw className="mr-2 inline size-4" />
              Rotate
            </button>
          ),
        },
        {
          title: "Revoke access",
          body: "Revocation is immediate and permanently disables the selected key.",
          action: (
            <button className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700">
              <ShieldOff className="mr-2 inline size-4" />
              Revoke
            </button>
          ),
        },
      ]}
    />
  );
}
