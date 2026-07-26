import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getSuperAdminNavigation } from "@/config/super-admin-navigation";
import { requireSuperAdmin } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireSuperAdmin();
  return (
    <AppShell
      title="Platform"
      userLabel={user.email ?? "Super Admin"}
      items={getSuperAdminNavigation(true)}
    >
      {children}
    </AppShell>
  );
}
