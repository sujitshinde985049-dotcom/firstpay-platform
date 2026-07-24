import type { ProviderRegistry } from "./provider-registry";
import type {
  PaymentProvider,
  ProviderCapability,
  ProviderEnvironment,
  RoutingDecision,
} from "./types";
export type RouteCandidate = {
  provider: PaymentProvider;
  priority: number;
  environment: ProviderEnvironment;
  healthy: boolean;
  default: boolean;
};
export function selectProvider(
  registry: ProviderRegistry,
  candidates: RouteCandidate[],
  capability: ProviderCapability,
  environment: ProviderEnvironment,
  manual?: PaymentProvider,
): RoutingDecision {
  const eligible = candidates.filter(
    (c) =>
      c.environment === environment &&
      c.healthy &&
      registry.supports(c.provider, capability),
  );
  if (manual) {
    const found = eligible.find((c) => c.provider === manual);
    if (!found)
      throw new Error(
        "Manual provider is unavailable or lacks the required capability.",
      );
    return {
      provider: found.provider,
      environment,
      reason: [
        "authorised manual override",
        "capability available",
        "provider healthy",
      ],
      automatic: false,
    };
  }
  const sorted = eligible.sort(
    (a, b) => Number(b.default) - Number(a.default) || a.priority - b.priority,
  );
  if (!sorted[0])
    throw new Error("No healthy configured provider supports this operation.");
  return {
    provider: sorted[0].provider,
    environment,
    reason: [
      "organisation assignment",
      "capability available",
      "provider healthy",
      "priority order",
    ],
    automatic: true,
    fallback: sorted[1]?.provider,
  };
}
