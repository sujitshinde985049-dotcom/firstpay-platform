import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="FirstPay home"
      className="inline-flex items-center gap-2.5 font-bold tracking-tight"
    >
      <span className="bg-brand grid size-9 place-items-center rounded-xl text-sm font-black text-white shadow-lg shadow-blue-500/20">
        F
      </span>
      <span className={inverse ? "text-white" : "text-foreground"}>
        FirstPay
      </span>
    </Link>
  );
}
