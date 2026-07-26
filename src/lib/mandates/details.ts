export type MandateDetailsAccess = {
  hasViewPermission: boolean;
  currentOrganisationId: string;
  mandateOrganisationId: string;
};

export function canViewMandateDetails({
  hasViewPermission,
  currentOrganisationId,
  mandateOrganisationId,
}: MandateDetailsAccess) {
  return hasViewPermission && currentOrganisationId === mandateOrganisationId;
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
