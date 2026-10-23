// ponytail: simple HMAC-SHA256 signature via Web Crypto. Upgrade to full JWT if multi-user RBAC is needed.

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Fail-closed: no hardcoded fallback. A missing secret means "deny", never "use default".
function getSecretKey(): string {
  const secret = process.env.PAGE_ACCESS_PASSWORD;
  if (!secret) throw new Error("PAGE_ACCESS_PASSWORD is not set");
  return secret;
}

async function hmacKey(usages: KeyUsage[]): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecretKey()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usages,
  );
}

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await hmacKey(["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time compare on equal-length strings (edge runtime has no timingSafeEqual).
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createAuthToken(): Promise<string> {
  const timestamp = Date.now().toString();
  // nonce makes every token unique (no collisions on same-millisecond logins) and
  // gives a handle for a future server-side revocation list.
  const nonce = crypto.randomUUID();
  const signature = await sign(`${timestamp}.${nonce}`);
  return `${timestamp}.${nonce}.${signature}`;
}

export async function verifyAuthToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [timestamp, nonce, sig] = parts;
  const ts = Number.parseInt(timestamp, 10);
  if (Number.isNaN(ts)) return false;

  if (Date.now() - ts > TOKEN_TTL_MS) return false;

  try {
    const expectedSig = await sign(`${timestamp}.${nonce}`);
    return safeEqual(sig, expectedSig);
  } catch {
    // Secret missing -> fail closed.
    return false;
  }
}
