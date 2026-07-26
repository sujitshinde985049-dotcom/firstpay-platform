export const featureKeys = [
  "upi_autopay",
  "e_nach",
  "reports",
  "api",
  "webhooks",
  "multiple_users",
  "priority_support",
  "cms",
  "media_manager",
  "blog",
  "analytics",
] as const;

export type FeatureKey = (typeof featureKeys)[number];

export type FeatureFlagValue = {
  key: string;
  enabled: boolean;
  organisation_id: string | null;
};

export function isFeatureEnabled(
  flags: FeatureFlagValue[],
  key: FeatureKey,
  organisationId: string,
) {
  const override = flags.find(
    (flag) => flag.key === key && flag.organisation_id === organisationId,
  );
  if (override) return override.enabled;

  return (
    flags.find((flag) => flag.key === key && flag.organisation_id === null)
      ?.enabled ?? false
  );
}

export function canCreateMandate({
  canManageMandates,
  upiAutoPayEnabled,
  eNachEnabled,
}: {
  canManageMandates: boolean;
  upiAutoPayEnabled: boolean;
  eNachEnabled: boolean;
}) {
  return canManageMandates && (upiAutoPayEnabled || eNachEnabled);
}
