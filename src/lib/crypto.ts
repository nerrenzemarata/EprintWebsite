import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Government ID numbers are encrypted with AES-256-GCM before they are stored, so a
// database leak alone doesn't reveal them. The key lives only in the server
// environment (ID_ENCRYPTION_KEY: 64 hex characters).

const KEY_HEX = process.env.ID_ENCRYPTION_KEY;

export const idEncryptionConfigured = Boolean(
  KEY_HEX && /^[0-9a-fA-F]{64}$/.test(KEY_HEX),
);

function key() {
  if (!idEncryptionConfigured) throw new Error("ID_ENCRYPTION_KEY is not configured.");
  return Buffer.from(KEY_HEX!, "hex");
}

export function encryptIdNumber(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return "v1:" + Buffer.concat([iv, tag, data]).toString("base64");
}

// Returns null if the value can't be decrypted (wrong key, tampered, or not set up).
export function decryptIdNumber(stored: string) {
  try {
    if (!stored.startsWith("v1:")) return null;
    const raw = Buffer.from(stored.slice(3), "base64");
    const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
