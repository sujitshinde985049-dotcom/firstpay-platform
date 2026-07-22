"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const transactions = [
  ["Aster Health", "UPI AutoPay", "₹48,200", "Success"],
  ["Northstar SaaS", "e-NACH", "₹1,24,800", "Success"],
  ["Meridian Credit", "UPI AutoPay", "₹76,500", "Processing"],
] as const;

export function DashboardPreview() {
  const reduceMotion = useReducedMotion();
  return (
    <div
      className="enterprise-shadow relative overflow-hidden rounded-[28px] border border-white/10 bg-[#091225] p-3 text-white sm:p-5"
      aria-label="FirstPay dashboard preview"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs text-slate-400">Live operations</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Collections" value="₹12.48 Cr" trend="12.8%" up />
        <Metric label="Success rate" value="98.74%" trend="0.9%" up />
        <Metric label="Active mandates" value="84,291" trend="1.2%" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Collection volume</p>
              <p className="mt-1 text-xl font-semibold">₹4.82 Cr</p>
            </div>
            <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
              Last 7 days
            </span>
          </div>
          <div
            className="mt-8 flex h-32 items-end gap-2"
            aria-label="Collection volume bar chart"
          >
            {[42, 64, 52, 76, 61, 88, 94, 73, 98, 82, 105, 112].map(
              (height, index) => (
                <motion.span
                  key={index}
                  className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-blue-700 to-cyan-300"
                  style={{
                    height: `${height}px`,
                    opacity: 0.55 + index * 0.035,
                  }}
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  whileInView={reduceMotion ? undefined : { scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.025 }}
                />
              ),
            )}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-slate-500">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Today</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs text-slate-400">Mandate health</p>
          <div
            className="relative mx-auto mt-5 grid size-32 place-items-center rounded-full"
            style={{
              background: "conic-gradient(#34d399 0 82%, #1e293b 82% 100%)",
            }}
          >
            <div className="grid size-24 place-items-center rounded-full bg-[#0c172b] text-center">
              <span>
                <strong className="block text-2xl">82%</strong>
                <small className="text-slate-400">active</small>
              </span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
            <span className="rounded-lg bg-white/5 p-2 text-slate-300">
              UPI 61%
            </span>
            <span className="rounded-lg bg-white/5 p-2 text-slate-300">
              e-NACH 39%
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-sm font-semibold">Recent transactions</p>
          <span className="text-xs text-blue-300">View all</span>
        </div>
        <div className="divide-y divide-white/10">
          {transactions.map(([name, mode, amount, status]) => (
            <div
              key={name}
              className="grid grid-cols-[1.5fr_1fr_auto] items-center gap-3 px-4 py-3 text-xs"
            >
              <span>
                <strong className="block font-medium text-slate-100">
                  {name}
                </strong>
                <small className="text-slate-500">{mode}</small>
              </span>
              <span className="text-right font-medium">{amount}</span>
              <span
                className={
                  status === "Success" ? "text-emerald-300" : "text-amber-300"
                }
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  trend,
  up = false,
}: {
  label: string;
  value: string;
  trend: string;
  up?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{label}</p>
        {up ? (
          <ArrowUpRight className="size-4 text-emerald-300" />
        ) : (
          <ArrowDownRight className="size-4 text-amber-300" />
        )}
      </div>
      <p className="mt-3 text-xl font-semibold">{value}</p>
      <p
        className={`mt-1 text-xs ${up ? "text-emerald-300" : "text-amber-300"}`}
      >
        {trend} vs last period
      </p>
    </div>
  );
}
