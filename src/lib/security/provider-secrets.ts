import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const algorithm = "aes-256-gcm";
const formatVersion = "v1";

const encryptionKey = () => {
  const configured = process.env.PAYMENT_CREDENTIAL_ENCRYPTION_KEY;
  if (!configured || configured.length < 32)
    throw new Error("Provider credential encryption is not configured.");
  return createHash("sha256").update(configured, "utf8").digest();
};

export function encryptProviderSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return [
    formatVersion,
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}

export function decryptProviderSecret(value: string) {
  const [version, ivValue, tagValue, encryptedValue, extra] = value.split(":");
  if (
    version !== formatVersion ||
    !ivValue ||
    !tagValue ||
    !encryptedValue ||
    extra
  )
    throw new Error("Provider credential has an invalid encrypted format.");

  try {
    const decipher = createDecipheriv(
      algorithm,
      encryptionKey(),
      Buffer.from(ivValue, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    throw new Error("Provider credential could not be decrypted.");
  }
}
