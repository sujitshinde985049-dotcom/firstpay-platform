import { Clock3, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Contact",
  "Talk to FirstPay about recurring payments, UPI AutoPay, e-NACH, and mandate management.",
  "/contact",
);
export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Let's design your payment operating layer"
        description="Tell us about your collection model, mandate volumes, integration needs, and launch goals."
        primary="Email enterprise sales"
        primaryHref="mailto:enterprise@firstpay.in"
        secondary="View system status"
        secondaryHref="/status"
      />
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold">Enterprise enquiries</h2>
            <p className="text-muted mt-3 leading-7">
              Our team will help map FirstPay to your product, engineering,
              operations, risk, and finance requirements.
            </p>
            <div className="mt-8 space-y-5">
              <a
                href="mailto:enterprise@firstpay.in"
                className="flex items-center gap-4 text-sm"
              >
                <ContactIcon icon={Mail} /> enterprise@firstpay.in
              </a>
              <div className="flex items-center gap-4 text-sm">
                <ContactIcon icon={Clock3} /> Monday–Friday, 9:30–18:30 IST
              </div>
              <div className="flex items-center gap-4 text-sm">
                <ContactIcon icon={MapPin} /> India
              </div>
            </div>
          </div>
          <form
            action="mailto:enterprise@firstpay.in"
            method="post"
            encType="text/plain"
            className="bg-surface grid gap-5 rounded-2xl border p-6 sm:grid-cols-2 sm:p-8"
          >
            <ContactField label="Full name" name="name" required />
            <ContactField
              label="Work email"
              name="email"
              type="email"
              required
            />
            <ContactField label="Company" name="company" required />
            <ContactField label="Monthly payment volume" name="volume" />
            <label className="text-sm font-semibold sm:col-span-2">
              How can we help?
              <textarea
                name="message"
                required
                rows={5}
                className="bg-background focus:border-brand mt-2 w-full rounded-xl border px-4 py-3 font-normal outline-none"
              />
            </label>
            <button
              type="submit"
              className="bg-brand rounded-xl px-5 py-3 text-sm font-semibold text-white sm:col-span-2"
            >
              Send enquiry
            </button>
            <p className="text-muted text-xs leading-5 sm:col-span-2">
              Submitting opens your email client so you can review the message
              before sending.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

function ContactIcon({ icon: Icon }: { icon: typeof Mail }) {
  return (
    <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

function ContactField({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="bg-background focus:border-brand mt-2 w-full rounded-xl border px-4 py-3 font-normal outline-none"
      />
    </label>
  );
}
