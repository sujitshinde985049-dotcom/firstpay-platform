import {
  Activity,
  BarChart3,
  BadgeIndianRupee,
  FileText,
  MousePointerClick,
  Users,
} from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Platform analytics"
      description="Privacy-conscious platform and client insight with tenant-scoped drill-downs."
      cards={[
        {
          title: "Top pages",
          description:
            "Page views and engagement trends from analytics events.",
          icon: FileText,
        },
        {
          title: "Top features",
          description: "Feature adoption across plans and organisations.",
          icon: MousePointerClick,
        },
        {
          title: "User activity",
          description: "Active-user and governed activity trends.",
          icon: Users,
        },
        {
          title: "Lead analytics",
          description: "Source, stage, conversion, and ownership performance.",
          icon: BarChart3,
        },
        {
          title: "Client analytics",
          description: "Organisation-scoped usage and adoption reporting.",
          icon: Activity,
        },
        {
          title: "Collection analytics",
          description:
            "Provider-neutral collection analytics placeholder with no payment processing.",
          icon: BadgeIndianRupee,
        },
      ]}
    />
  );
}
