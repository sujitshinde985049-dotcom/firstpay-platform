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
  { href: "/super-admin/blog", label: "Blog" },
  { href: "/super-admin/seo", label: "SEO" },
  { href: "/super-admin/email-templates", label: "Email templates" },
  { href: "/super-admin/notifications", label: "Notifications" },
  { href: "/super-admin/analytics", label: "Analytics" },
  { href: "/super-admin/system-health", label: "System health" },
  { href: "/super-admin/integrations", label: "Integrations" },
  { href: "/super-admin/providers", label: "Payment providers" },
  { href: "/super-admin/provider-routing", label: "Provider routing" },
  { href: "/super-admin/provider-health", label: "Provider health" },
  { href: "/super-admin/provider-errors", label: "Provider errors" },
  { href: "/super-admin/merchant-onboarding", label: "Merchant onboarding" },
  { href: "/super-admin/reconciliation", label: "Reconciliation" },
  { href: "/super-admin/search", label: "Global search" },
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
