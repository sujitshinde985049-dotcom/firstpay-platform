import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireSuperAdmin } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

const items = [
  { href: "/super-admin", label: "Platform overview" },
  { href: "/super-admin/organisations", label: "Organisations" },
  { href: "/super-admin/plans", label: "Plans" },
  { href: "/super-admin/settings", label: "Platform settings" },
];

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
      items={items}
    >
      {children}
    </AppShell>
  );
}
