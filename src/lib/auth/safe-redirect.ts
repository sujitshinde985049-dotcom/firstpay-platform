export function safeInternalRedirect(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("\0")
  )
    return fallback;
  try {
    const parsed = new URL(value, "https://firstpay.invalid");
    return parsed.origin === "https://firstpay.invalid"
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
