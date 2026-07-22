"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pending = "Saving…",
  tone = "primary",
}: {
  children: React.ReactNode;
  pending?: string;
  tone?: "primary" | "danger" | "secondary";
}) {
  const { pending: isPending } = useFormStatus();
  const styles =
    tone === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : tone === "secondary"
        ? "border bg-white text-slate-800 dark:bg-slate-950 dark:text-white"
        : "bg-blue-700 text-white hover:bg-blue-800";
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`rounded-lg px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {isPending ? pending : children}
    </button>
  );
}
