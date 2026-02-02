import { randomBytes, createHash } from "crypto";

const API_KEY_PREFIX = "dsc_";

export function generateApiKey(): {
  plaintext: string;
  hash: string;
  prefix: string;
} {
  const random = randomBytes(16).toString("hex"); // 32 hex chars
  const plaintext = `${API_KEY_PREFIX}${random}`;
  const hash = hashApiKey(plaintext);
  const prefix = `${API_KEY_PREFIX}${random.slice(0, 4)}`;
  return { plaintext, hash, prefix };
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function isValidApiKeyFormat(key: string): boolean {
  return /^dsc_[a-f0-9]{32}$/.test(key);
}
