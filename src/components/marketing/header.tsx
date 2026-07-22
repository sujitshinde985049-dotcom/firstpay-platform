"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/marketing/logo";

const productLinks = [
  ["UPI AutoPay", "/upi-autopay", "Real-time recurring collections"],
  ["e-NACH", "/e-nach", "Bank-account mandates at scale"],
  ["Recurring Payments", "/recurring-payments", "Lifecycle automation"],
  ["Mandate Management", "/mandate-management", "One control plane"],
] as const;

const navLinks = [
  ["Solutions", "/solutions"],
  ["Developers", "/developers"],
  ["Industries", "/industries"],
  ["Company", "/about"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${scrolled ? "border-border/70 bg-surface/85 shadow-sm backdrop-blur-xl" : "bg-background/75 border-transparent backdrop-blur-md"}`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Logo />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          <div className="group relative">
            <button
              type="button"
              className="text-muted hover:text-foreground flex items-center gap-1 py-6 text-sm font-semibold"
              aria-haspopup="true"
            >
              Products <ChevronDown className="size-4" aria-hidden />
            </button>
            <div className="bg-surface-raised invisible absolute top-full left-1/2 w-[520px] -translate-x-1/2 translate-y-2 rounded-2xl border p-3 opacity-0 shadow-2xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-1">
                {productLinks.map(([label, href, description]) => (
                  <Link
                    key={href}
                    href={href}
                    className="hover:bg-surface-muted focus:bg-surface-muted rounded-xl p-4"
                  >
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="text-muted mt-1 block text-xs leading-5">
                      {description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-muted hover:text-foreground text-sm font-semibold"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-muted hover:text-foreground px-3 py-2 text-sm font-semibold"
          >
            Sign in
          </Link>
          <Link
            href="/contact"
            className="bg-brand hover:bg-brand-strong rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            Talk to sales
          </Link>
        </div>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 lg:hidden"
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>
      {open ? (
        <nav
          aria-label="Mobile navigation"
          className="bg-surface border-t px-5 py-5 lg:hidden"
        >
          <p className="text-muted mb-2 text-xs font-bold tracking-widest uppercase">
            Products
          </p>
          {productLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg py-2.5 text-sm font-semibold"
            >
              {label}
            </Link>
          ))}
          <div className="my-4 border-t" />
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg py-2.5 text-sm font-semibold"
            >
              {label}
            </Link>
          ))}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/login"
              className="rounded-xl border px-4 py-3 text-center text-sm font-semibold"
            >
              Sign in
            </Link>
            <Link
              href="/contact"
              className="bg-brand rounded-xl px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Talk to sales
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
