import { ShieldAlert } from "lucide-react";
export default function Page() {
  return (
    <main className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:bg-amber-950/30">
      <ShieldAlert className="mx-auto size-8 text-amber-700" />
      <h1 className="mt-4 text-2xl font-bold">Workspace suspended</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        This organisation cannot use dashboard functions. Contact FirstPay
        support for a status review.
      </p>
    </main>
  );
}
