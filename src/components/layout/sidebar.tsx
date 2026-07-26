import Link from "next/link";

type SidebarProps = {
  title: string;
  items: Array<{ href: string; label: string }>;
};

export function Sidebar({ title, items }: SidebarProps) {
  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <Link href="/" className="font-bold text-blue-700 dark:text-blue-400">
          FirstPay
        </Link>
        <span className="ml-2 text-xs text-slate-500">{title}</span>
      </div>
      <nav
        className="flex gap-2 overflow-x-auto p-4 lg:block lg:max-h-[calc(100vh-4rem)] lg:space-y-1 lg:overflow-y-auto"
        aria-label="Primary navigation"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-700 hover:bg-blue-50 hover:text-blue-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
