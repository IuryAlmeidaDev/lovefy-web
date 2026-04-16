import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createDraftToken() {
  return randomBytes(32).toString("base64url");
}

export function hashDraftToken(token: string) {
  const secret = process.env.DRAFT_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error("DRAFT_TOKEN_SECRET is required for anonymous draft uploads.");
  }

  return createHash("sha256").update(`${secret}:${token}`).digest("hex");
}

export function verifyDraftToken(token: string, hash: string) {
  const candidate = Buffer.from(hashDraftToken(token), "hex");
  const expected = Buffer.from(hash, "hex");

  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
