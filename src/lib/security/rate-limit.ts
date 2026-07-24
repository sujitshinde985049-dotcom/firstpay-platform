export type RateLimitScope =
  | "login"
  | "password_reset"
  | "contact"
  | "demo"
  | "newsletter"
  | "invitation"
  | "api"
  | "webhook"
  | "provider_operation"
  | "export";
export type RateLimitDecision = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
  productionGrade: boolean;
};
export interface RateLimitAdapter {
  check(
    scope: RateLimitScope,
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<RateLimitDecision>;
}
export class UnconfiguredRateLimitAdapter implements RateLimitAdapter {
  async check(
    _scope: RateLimitScope,
    _key: string,
    limit: number,
    _window: number,
  ) {
    void _window;
    return {
      allowed: process.env.NODE_ENV !== "production",
      remaining: process.env.NODE_ENV !== "production" ? limit : 0,
      retryAfterSeconds: process.env.NODE_ENV === "production" ? 60 : undefined,
      productionGrade: false,
    };
  }
}
export function getRateLimitAdapter(): RateLimitAdapter {
  return new UnconfiguredRateLimitAdapter();
}
