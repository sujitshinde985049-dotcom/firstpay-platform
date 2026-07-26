import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  isFeatureEnabled,
  type FeatureFlagValue,
  type FeatureKey,
} from "./rules";

export async function getOrganisationFeatures(
  organisationId: string,
  keys: FeatureKey[],
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feature_flags")
    .select("key,enabled,organisation_id")
    .in("key", keys)
    .or(`organisation_id.is.null,organisation_id.eq.${organisationId}`);

  if (error)
    throw new Error("Unable to load organisation feature flags.", {
      cause: error,
    });

  const flags = (data ?? []) as FeatureFlagValue[];
  return Object.fromEntries(
    keys.map((key) => [key, isFeatureEnabled(flags, key, organisationId)]),
  ) as Record<FeatureKey, boolean>;
}
