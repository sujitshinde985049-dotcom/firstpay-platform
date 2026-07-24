import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/user";
import { getIsSuperAdmin } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/mandates", label: "Mandates" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/settlements", label: "Settlements" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/reports", label: "Reports" },
  { href: "/dashboard/team", label: "Team" },
  { href: "/dashboard/webhooks", label: "Webhooks" },
  { href: "/dashboard/api-credentials", label: "API credentials" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/profile", label: "Organisation profile" },
  { href: "/dashboard/integrations/providers", label: "Providers" },
  { href: "/dashboard/integrations/provider-status", label: "Provider status" },
  { href: "/dashboard/integrations/webhooks", label: "Provider webhooks" },
  { href: "/dashboard/onboarding", label: "Onboarding" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  if (await getIsSuperAdmin()) redirect("/super-admin");
  return (
    <AppShell
      title="Workspace"
      userLabel={user.email ?? "Signed in"}
      items={items}
    >
      {children}
    </AppShell>
  );
}
