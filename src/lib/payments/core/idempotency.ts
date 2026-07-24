import { createHash } from "node:crypto";
export function requestHash(payload: unknown) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}
export function idempotencyKey(parts: string[]) {
  return createHash("sha256").update(parts.join(":")).digest("hex");
}
