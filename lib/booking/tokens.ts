// Signed, tamper-proof tokens for reschedule/cancel email links.
// HMAC-SHA256 over a tiny JSON payload — no DB lookup needed to validate.
import { createHmac, timingSafeEqual } from "crypto";

export type LinkAction = "reschedule" | "cancel";

const secret = () =>
  process.env.BOOKING_SIGNING_SECRET || "dev-insecure-secret-change-me";

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

/** Sign a {bookingId, action} pair into an opaque token for email links. */
export function signActionToken(bookingId: string, action: LinkAction): string {
  const payload = b64url(JSON.stringify({ id: bookingId, a: action }));
  const sig = b64url(createHmac("sha256", secret()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifyActionToken(
  token: string | null | undefined,
): { bookingId: string; action: LinkAction } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = b64url(
    createHmac("sha256", secret()).update(payload).digest(),
  );
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const json = JSON.parse(fromB64url(payload).toString("utf8"));
    if (
      json &&
      typeof json.id === "string" &&
      (json.a === "reschedule" || json.a === "cancel")
    ) {
      return { bookingId: json.id, action: json.a as LinkAction };
    }
    return null;
  } catch {
    return null;
  }
}
