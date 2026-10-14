// ponytail: simple HMAC-SHA256 signature via Web Crypto. Upgrade to full JWT if multi-user RBAC is needed.

const SECRET_KEY = process.env.PAGE_ACCESS_PASSWORD || "najmi-cms-secret-key-2026";

export async function createAuthToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const hexSig = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${timestamp}.${hexSig}`;
}

export async function verifyAuthToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, sig] = parts;
  const ts = Number.parseInt(timestamp, 10);
  if (Number.isNaN(ts)) return false;

  // 7 days expiration window
  if (Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expectedSigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const expectedSig = Array.from(new Uint8Array(expectedSigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return sig === expectedSig;
}
