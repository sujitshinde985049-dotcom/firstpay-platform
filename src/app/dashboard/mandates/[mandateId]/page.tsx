import type { SupabaseClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { PendingMandateAction } from "@/components/dashboard/pending-mandate-action";
import { hasPermission } from "@/lib/auth/permissions";
import { canViewMandateDetails } from "@/lib/mandates/details";
import { requireOrganisation } from "@/lib/organisations/current";
import { createClient } from "@/lib/supabase/server";

type ProviderAttempt = {
  provider_reference: string | null;
  status: string;
  safe_failure_message: string | null;
  created_at: string;
  provider: { key: string; name: string } | null;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default async function Page({
  params,
}: {
  params: Promise<{ mandateId: string }>;
}) {
  const { mandateId } = await params;
  const organisation = await requireOrganisation();
  const canView = await hasPermission(organisation.id, "mandates.view");
  if (!canView) notFound();

  const typedClient = await createClient();
  const { data: mandate, error } = await typedClient
    .from("mandates")
    .select(
      "id,organisation_id,reference,type,amount,frequency,status,metadata,created_at,updated_at,customer:customers(company,contact_name)",
    )
    .eq("id", mandateId)
    .eq("organisation_id", organisation.id)
    .maybeSingle();
  if (error) {
    throw new Error("Unable to load mandate details.", { cause: error });
  }
  if (
    !mandate ||
    !canViewMandateDetails({
      hasViewPermission: canView,
      currentOrganisationId: organisation.id,
      mandateOrganisationId: mandate.organisation_id,
    })
  ) {
    notFound();
  }

  const orchestrationClient = typedClient as unknown as SupabaseClient;
  const { data: attemptData, error: attemptError } = await orchestrationClient
    .from("mandate_attempts")
    .select(
      "provider_reference,status,safe_failure_message,created_at,provider:payment_providers(key,name)",
    )
    .eq("mandate_id", mandate.id)
    .eq("organisation_id", organisation.id)
    .order("attempt_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (attemptError) {
    throw new Error("Unable to load mandate provider status.", {
      cause: attemptError,
    });
  }

  const attempt = attemptData as ProviderAttempt | null;
  const customer = Array.isArray(mandate.customer)
    ? mandate.customer[0]
    : mandate.customer;
  const providerKey = attempt?.provider?.key ?? null;
  const fields = [
    ["Customer", customer?.company ?? customer?.contact_name ?? "—"],
    ["Provider", attempt?.provider?.name ?? "Not assigned"],
    ["Mandate type", mandate.type === "upi_autopay" ? "UPI AutoPay" : "e-NACH"],
    [
      "Amount",
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(Number(mandate.amount)),
    ],
    ["Frequency", mandate.frequency],
    ["Created", formatDate(mandate.created_at)],
    ["Updated", formatDate(mandate.updated_at)],
    [
      "Provider transaction / subscription reference",
      attempt?.provider_reference ?? "—",
    ],
    [
      "Sanitized provider status",
      attempt?.status ?? "No provider request recorded",
    ],
    ["Sanitized provider error", attempt?.safe_failure_message ?? "—"],
  ];

  return (
    <div>
      <PageHeader
        title={mandate.reference}
        description="Tenant-scoped mandate and provider status details."
        actions={<StatusBadge value={mandate.status} />}
      />
      <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium break-words capitalize">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="mt-6 rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <h2 className="text-base font-semibold">Next action</h2>
        <div className="mt-3">
          <PendingMandateAction
            mandateStatus={mandate.status}
            providerKey={providerKey}
            metadata={mandate.metadata}
          />
          {mandate.status === "pending" && !providerKey ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No provider request has been recorded for this mandate. There is
              no implemented continuation or retry action to show.
            </p>
          ) : null}
          {mandate.status !== "pending" ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No action is currently required.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
