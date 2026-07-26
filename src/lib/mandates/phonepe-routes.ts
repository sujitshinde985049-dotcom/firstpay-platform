export const phonePeReturnPath = (mandateId: string) =>
  `/phonepe/return/${mandateId}`;

const withProtocol = (value: string) =>
  /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;

export function resolveApplicationOrigin(
  environment: Record<string, string | undefined>,
) {
  const configured = environment.NEXT_PUBLIC_APP_URL;
  const vercelHost =
    environment.VERCEL_PROJECT_PRODUCTION_URL ?? environment.VERCEL_URL;
  const configuredUrl = configured ? new URL(withProtocol(configured)) : null;
  const configuredIsLocal =
    configuredUrl?.hostname === "localhost" ||
    configuredUrl?.hostname === "127.0.0.1";

  if (
    vercelHost &&
    (!configuredUrl ||
      (environment.NODE_ENV === "production" && configuredIsLocal))
  ) {
    return new URL(withProtocol(vercelHost)).origin;
  }
  if (!configuredUrl) {
    throw new Error("Public application URL is not configured.");
  }

  return configuredUrl.origin;
}

export function phonePeReturnUrl(
  environment: Record<string, string | undefined>,
  mandateId: string,
) {
  return new URL(
    phonePeReturnPath(mandateId),
    resolveApplicationOrigin(environment),
  ).toString();
}
