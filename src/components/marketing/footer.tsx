import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

const groups = [
  {
    title: "Products",
    links: [
      ["UPI AutoPay", "/upi-autopay"],
      ["e-NACH", "/e-nach"],
      ["Recurring Payments", "/recurring-payments"],
      ["Mandates", "/mandate-management"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Developers", "/developers"],
      ["Blog", "/blog"],
      ["FAQ", "/faq"],
      ["System status", "/status"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Industries", "/industries"],
      ["Contact", "/contact"],
      ["Data security", "/data-security"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Refund policy", "/refund-policy"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-[#050b18] text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_3fr]">
          <div>
            <Logo inverse />
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Enterprise payment infrastructure for high-trust recurring
              collections and digital mandates.
            </p>
            <p className="mt-6 text-sm text-slate-500">
              Built in India. Engineered for scale.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-white">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-slate-400 hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} FirstPay Technologies. All rights
            reserved.
          </p>
          <p>Payments are subject to partner bank and network availability.</p>
        </div>
      </div>
    </footer>
  );
}
