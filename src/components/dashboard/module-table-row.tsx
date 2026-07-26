import Link from "next/link";
import { StatusBadge } from "../admin/status-badge";
import type { ModuleRow } from "./module-page";

export function ModuleTableRow({ row }: { row: ModuleRow }) {
  return (
    <tr
      className={
        row.href
          ? "relative transition-colors focus-within:bg-slate-50 hover:bg-slate-50 dark:focus-within:bg-slate-900/60 dark:hover:bg-slate-900/60"
          : undefined
      }
    >
      <td className="px-5 py-4">
        {row.href ? (
          <Link
            href={row.href}
            className="font-semibold outline-none after:absolute after:inset-0 focus-visible:underline"
            aria-label={`View ${row.primary}`}
          >
            {row.primary}
          </Link>
        ) : (
          <strong className="block">{row.primary}</strong>
        )}
        <span className="block text-xs text-slate-500">{row.secondary}</span>
      </td>
      <td className="px-5 py-4">
        <StatusBadge value={row.status} />
      </td>
      <td className="px-5 py-4 font-medium">{row.value}</td>
      <td className="px-5 py-4 text-slate-500">{row.date}</td>
    </tr>
  );
}
