import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  description,
  primary = "Talk to sales",
  primaryHref = "/contact",
  secondary = "Explore developers",
  secondaryHref = "/developers",
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary?: string;
  primaryHref?: string;
  secondary?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b py-18 sm:py-24">
      <div className="marketing-grid absolute inset-0 -z-10 opacity-70" />
      <div className="absolute -top-32 left-1/2 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-brand text-sm font-bold tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-balance sm:text-6xl">
            {title}
          </h1>
          <p className="text-muted mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="bg-brand inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            >
              {primary}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="bg-surface rounded-xl border px-5 py-3 text-center text-sm font-semibold"
            >
              {secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
