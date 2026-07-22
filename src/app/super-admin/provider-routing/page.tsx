import { Network, Route, ShieldCheck, ToggleLeft } from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Provider routing"
      description="Capability- and health-aware routing with explicit financial safety controls."
      cards={[
        {
          title: "Primary and backup",
          description:
            "Organisation defaults, priorities, methods, amount bands, and environments.",
          icon: Route,
        },
        {
          title: "Automatic selection",
          description:
            "Filters disabled, unhealthy, unsupported, or wrong-environment providers.",
          icon: Network,
        },
        {
          title: "Manual override",
          description:
            "Authorised Super Admin override with recorded routing reason.",
          icon: ToggleLeft,
        },
        {
          title: "Debit safety",
          description:
            "Cross-provider financial debit retry is forbidden without guaranteed idempotency and duplicate-debit protection.",
          icon: ShieldCheck,
        },
      ]}
    />
  );
}
