import type { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { PendingMandateAction } from "@/components/dashboard/pending-mandate-action";
import { hasPermission } from "@/lib/auth/permissions";
import {
  canViewMandateDetails,
  formatOptionalAmount,
  formatOptionalDate,
  mandateDetailsSelect,
  optionalText,
  unavailable,
} from "@/lib/mandates/details";
import { correlationId, logServerEvent } from "@/lib/observability/logger";
import { requireOrganisation } from "@/lib/organisations/current";
import { createClient } from "@/lib/supabase/server";

type ProviderAttempt = {
  provider_id: string;
  provider_reference: string | null;
  status: string;
  safe_failure_message: string | null;
};

type Provider = {
  key: string;
  name: string;
};

type ProviderRequest = {
  id: string;
  provider_id: string;
  status: string;
};

type ProviderError = {
  safe_message: string;
};

function databaseErrorCode(error: unknown) {
  if (!error || typeof error !== "object") return "unknown";
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : "unknown";
}

function logLoadIssue(
  level: "warn" | "error",
  supportReference: string,
  stage: string,
  error: unknown,
) {
  logServerEvent(level, "mandate_details.load_failed", {
    supportReference,
    stage,
    databaseErrorCode: databaseErrorCode(error),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ mandateId: string }>;
}) {
  const { mandateId } = await params;
  const organisation = await requireOrganisation();
  const canView = await hasPermission(organisation.id, "mandates.view");
  if (!canView) notFound();

  const requestHeaders = await headers();
  const supportReference = correlationId(
    requestHeaders.get("x-vercel-id") ?? requestHeaders.get("x-request-id"),
  );
  const typedClient = await createClient();
  const { data: mandate, error } = await typedClient
    .from("mandates")
    .select(mandateDetailsSelect)
    .eq("id", mandateId)
    .eq("organisation_id", organisation.id)
    .maybeSingle();
  if (error) {
    logLoadIssue("error", supportReference, "mandate", error);
    throw Object.assign(new Error("Unable to load mandate details."), {
      cause: error,
      digest: supportReference,
    });
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

  const { data: customer, error: customerError } = await typedClient
    .from("customers")
    .select("company,contact_name")
    .eq("id", mandate.customer_id)
    .eq("organisation_id", organisation.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (customerError) {
    logLoadIssue("warn", supportReference, "customer", customerError);
  }

  const orchestrationClient = typedClient as unknown as SupabaseClient;
  const { data: attemptData, error: attemptError } = await orchestrationClient
    .from("mandate_attempts")
    .select("provider_id,provider_reference,status,safe_failure_message")
    .eq("mandate_id", mandate.id)
    .eq("organisation_id", organisation.id)
    .order("attempt_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (attemptError) {
    logLoadIssue("warn", supportReference, "provider_attempt", attemptError);
  }

  const attempt = attemptError ? null : (attemptData as ProviderAttempt | null);
  const { data: requestData, error: requestError } = await orchestrationClient
    .from("provider_requests")
    .select("id,provider_id,status")
    .eq("organisation_id", organisation.id)
    .contains("safe_metadata", { mandate_id: mandate.id })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (requestError) {
    logLoadIssue("warn", supportReference, "provider_request", requestError);
  }
  const providerRequest = requestError
    ? null
    : (requestData as ProviderRequest | null);

  let providerFailure: ProviderError | null = null;
  if (providerRequest?.id) {
    const { data: failureData, error: failureError } = await orchestrationClient
      .from("provider_errors")
      .select("safe_message")
      .eq("request_id", providerRequest.id)
      .eq("organisation_id", organisation.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (failureError) {
      logLoadIssue("warn", supportReference, "provider_error", failureError);
    } else {
      providerFailure = failureData as ProviderError | null;
    }
  }

  let provider: Provider | null = null;
  const providerId = attempt?.provider_id ?? providerRequest?.provider_id;
  if (providerId) {
    const { data: providerData, error: providerError } =
      await orchestrationClient
        .from("payment_providers")
        .select("key,name")
        .eq("id", providerId)
        .maybeSingle();
    if (providerError) {
      logLoadIssue("warn", supportReference, "provider", providerError);
    } else {
      provider = providerData as Provider | null;
    }
  }

  const providerKey = provider?.key ?? null;
  const fields = [
    ["Customer", optionalText(customer?.company ?? customer?.contact_name)],
    ["Provider", optionalText(provider?.name)],
    [
      "Mandate type",
      mandate.type === "upi_autopay"
        ? "UPI AutoPay"
        : mandate.type === "e_nach"
          ? "e-NACH"
          : unavailable,
    ],
    ["Amount", formatOptionalAmount(mandate.amount)],
    ["Frequency", optionalText(mandate.frequency)],
    ["Created", formatOptionalDate(mandate.created_at)],
    ["Updated", formatOptionalDate(mandate.updated_at)],
    [
      "Provider transaction / subscription reference",
      optionalText(attempt?.provider_reference),
    ],
    [
      "Sanitized provider status",
      optionalText(attempt?.status ?? providerRequest?.status),
    ],
    [
      "Sanitized provider error",
      optionalText(
        attempt?.safe_failure_message ?? providerFailure?.safe_message,
      ),
    ],
  ];

  return (
    <div>
      <PageHeader
        title={optionalText(mandate.reference)}
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
          {mandate.status === "pending" && !providerRequest && !attempt ? (
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
