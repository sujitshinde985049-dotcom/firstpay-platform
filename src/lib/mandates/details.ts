export type MandateDetailsAccess = {
  hasViewPermission: boolean;
  currentOrganisationId: string;
  mandateOrganisationId: string;
};

export const unavailable = "Not available";
export const mandateDetailsSelect =
  "id,organisation_id,customer_id,reference,type,amount,frequency,status,metadata,created_at,updated_at";

export function canViewMandateDetails({
  hasViewPermission,
  currentOrganisationId,
  mandateOrganisationId,
}: MandateDetailsAccess) {
  return hasViewPermission && currentOrganisationId === mandateOrganisationId;
}

export function formatOptionalDate(value: string | null | undefined) {
  if (!value) return unavailable;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatOptionalAmount(value: number | null | undefined) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return unavailable;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value));
}

export function optionalText(value: string | null | undefined) {
  const text = value?.trim();
  return text || unavailable;
}

export function getPhonePeAuthorizationUrl(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const record = metadata as Record<string, unknown>;
  const candidate =
    record.authorization_url ??
    record.authorizationUrl ??
    record.redirect_url ??
    record.redirectUrl;
  if (typeof candidate !== "string") return null;

  try {
    const url = new URL(candidate);
    if (
      url.protocol !== "https:" ||
      (url.hostname !== "phonepe.com" && !url.hostname.endsWith(".phonepe.com"))
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function getPendingMandateAction({
  mandateStatus,
  providerKey,
  metadata,
}: {
  mandateStatus: string;
  providerKey: string | null;
  metadata: unknown;
}) {
  if (mandateStatus !== "pending" || providerKey?.toLowerCase() !== "phonepe") {
    return null;
  }

  const href = getPhonePeAuthorizationUrl(metadata);
  return href
    ? {
        label: "Open PhonePe authorization",
        href,
      }
    : null;
}
