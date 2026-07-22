import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/user";

export const dynamic = "force-dynamic";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/team", label: "Team" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
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
