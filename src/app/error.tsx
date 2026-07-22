"use client";
import { useEffect } from "react";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error", { digest: error.digest });
  }, [error.digest]);
  return (
    <main className="grid min-h-[70vh] place-items-center p-6">
      <div className="max-w-lg rounded-2xl border bg-white p-8 text-center dark:bg-slate-950">
        <p className="text-sm font-semibold text-red-700">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          We could not complete that request
        </h1>
        <p className="mt-4 text-slate-500">
          Try again. If the problem continues, share support reference{" "}
          {error.digest ?? "unavailable"}.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
