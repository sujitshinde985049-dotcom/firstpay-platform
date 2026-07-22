import type { ReactNode } from "react";
import Link from "next/link";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Link
          href="/"
          className="text-lg font-bold text-blue-700 dark:text-blue-400"
        >
          FirstPay
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
