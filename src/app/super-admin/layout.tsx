import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireSuperAdmin } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

const items = [
  { href: "/super-admin", label: "Overview" },
  { href: "/super-admin/clients", label: "Clients" },
  { href: "/super-admin/users", label: "Users" },
  { href: "/super-admin/permissions", label: "Permissions" },
  { href: "/super-admin/plans", label: "Plans" },
  { href: "/super-admin/feature-flags", label: "Feature flags" },
  { href: "/super-admin/audit", label: "Audit logs" },
  { href: "/super-admin/announcements", label: "Announcements" },
  { href: "/super-admin/media", label: "Media" },
  { href: "/super-admin/cms", label: "CMS" },
  { href: "/super-admin/settings", label: "Settings" },
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
