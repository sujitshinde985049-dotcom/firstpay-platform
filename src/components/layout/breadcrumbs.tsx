"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
    >
      <Link
        href="/dashboard"
        className="hover:text-blue-700 dark:hover:text-blue-400"
      >
        Home
      </Link>
      {segments.slice(1).map((segment, index) => {
        const href = `/${segments.slice(0, index + 2).join("/")}`;
        return (
          <span key={href} className="flex items-center gap-2">
            <span aria-hidden> / </span>
            <Link
              href={href}
              className="capitalize hover:text-blue-700 dark:hover:text-blue-400"
            >
              {segment.replaceAll("-", " ")}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
