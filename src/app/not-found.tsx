import Link from "next/link";
export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center p-6 text-center">
      <div>
        <p className="text-sm font-bold text-blue-700">404</p>
        <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-slate-500">
          The requested page may have moved or is unavailable.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
