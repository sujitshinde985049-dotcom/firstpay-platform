import { logout } from "@/app/auth/actions";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function TopNavigation({ userLabel }: { userLabel: string }) {
  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-950">
      <Breadcrumbs />
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-600 sm:inline dark:text-slate-400">
          {userLabel}
        </span>
        <ThemeToggle />
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-950"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
