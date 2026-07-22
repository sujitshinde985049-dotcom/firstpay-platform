export const metadata = { robots: { index: false, follow: false } };
export default function Page() {
  return (
    <main className="grid min-h-[70vh] place-items-center p-6 text-center">
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold">
          Service configuration unavailable
        </h1>
        <p className="mt-4 text-slate-500">
          FirstPay is not fully configured for this environment. No sensitive
          configuration details are displayed. Contact platform operations.
        </p>
      </div>
    </main>
  );
}
