import Link from "next/link";

export function Pagination({
  page,
  pages,
  basePath,
  query = {},
}: {
  page: number;
  pages: number;
  basePath: string;
  query?: Record<string, string>;
}) {
  const href = (target: number) =>
    `${basePath}?${new URLSearchParams({ ...query, page: String(target) })}`;
  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-between"
    >
      <p className="text-sm text-slate-500">
        Page {page} of {pages}
      </p>
      <div className="flex gap-2">
        <Link
          aria-disabled={page <= 1}
          href={href(Math.max(1, page - 1))}
          className="rounded-lg border px-3 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          Previous
        </Link>
        <Link
          aria-disabled={page >= pages}
          href={href(Math.min(pages, page + 1))}
          className="rounded-lg border px-3 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          Next
        </Link>
      </div>
    </nav>
  );
}
