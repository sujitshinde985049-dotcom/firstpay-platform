import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavigation } from "@/components/layout/top-navigation";

export function AppShell({
  title,
  userLabel,
  items,
  children,
}: {
  title: string;
  userLabel: string;
  items: Array<{ href: string; label: string }>;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar title={title} items={items} />
      <div className="lg:pl-64">
        <TopNavigation userLabel={userLabel} />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
