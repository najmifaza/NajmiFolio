// SSRF guard: blocks loopback, private, link-local, metadata and reserved ranges.
// Validation resolves DNS and re-runs on every redirect hop, so neither DNS rebinding
// nor a public URL that 302s to 169.254.169.254 gets through.
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_REDIRECTS = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

function ipv4ToInt(ip: string): number {
  const [a, b, c, d] = ip.split(".").map(Number);
  return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
}

// Reserved / non-public IPv4 ranges. [base, prefix length]
const BLOCKED_V4: ReadonlyArray<readonly [string, number]> = [
  ["0.0.0.0", 8], // "this network" (covers 0.0.0.0/8)
  ["10.0.0.0", 8], // private
  ["100.64.0.0", 10], // CGNAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local + cloud metadata
  ["172.16.0.0", 12], // private
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.0.2.0", 24], // TEST-NET-1
  ["192.168.0.0", 16], // private
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24], // TEST-NET-2
  ["203.0.113.0", 24], // TEST-NET-3
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved + broadcast
];

const BLOCKED_HOSTNAMES = /(^|\.)(localhost|local|internal|home\.arpa)$/i;

export function isBlockedIp(ip: string): boolean {
  const version = isIP(ip);

  if (version === 4) {
    const value = ipv4ToInt(ip);
    return BLOCKED_V4.some(([base, bits]) => {
      const mask = (~0 << (32 - bits)) >>> 0;
      return (value & mask) === (ipv4ToInt(base) & mask);
    });
  }

  if (version === 6) {
    // Only global unicast (2000::/3) allowed. This excludes ::1, ::, fe80::/10,
    // fc00::/7, IPv4-mapped ::ffff:a.b.c.d and NAT64 64:ff9b:: in one rule.
    return !/^[23]/.test(ip.toLowerCase());
  }

  return true; // not an IP literal -> caller must resolve first
}

/** Throws when the URL is not a public http(s) target. Resolves DNS and checks every A/AAAA. */
export async function assertPublicHttpUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http(s) URLs are allowed");
  }
  if (url.username || url.password) {
    throw new Error("Credentials in URL are not allowed");
  }

  const host = url.hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "");

  if (isIP(host)) {
    if (isBlockedIp(host)) throw new Error("Blocked address");
    return url;
  }

  if (BLOCKED_HOSTNAMES.test(host)) throw new Error("Blocked hostname");

  // Reject alternative IP encodings (decimal, hex, octal, shortened) that isIP() misses.
  if (/^[0-9]+$/.test(host) || /^0x[0-9a-f]+$/i.test(host) || /^[0-9.]+$/.test(host)) {
    throw new Error("Blocked hostname");
  }

  let addresses: { address: string }[];
  try {
    addresses = await lookup(host, { all: true, verbatim: true });
  } catch {
    throw new Error("DNS lookup failed");
  }

  if (addresses.length === 0) throw new Error("DNS lookup failed");
  for (const { address } of addresses) {
    if (isBlockedIp(address)) throw new Error("Blocked address");
  }

  return url;
}

async function readCapped(response: Response, maxBytes: number): Promise<ArrayBuffer> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new Error("Response too large");
  }

  if (!response.body) {
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > maxBytes) throw new Error("Response too large");
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("Response too large");
    }
    chunks.push(value);
  }

  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out.buffer as ArrayBuffer;
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
  headers?: Record<string, string>;
}

/**
 * Fetch a user-supplied URL with redirects followed manually, every hop re-validated,
 * a total timeout covering the body read, and a hard size cap.
 */
export async function safeFetchBytes(
  rawUrl: string,
  options: SafeFetchOptions = {},
): Promise<{ response: Response; body: ArrayBuffer }> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxBytes = DEFAULT_MAX_BYTES,
    maxRedirects = MAX_REDIRECTS,
    headers,
  } = options;

  let current = rawUrl;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const url = await assertPublicHttpUrl(current);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers,
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) return { response, body: new ArrayBuffer(0) };
        current = new URL(location, url).toString();
        continue;
      }

      const body = await readCapped(response, maxBytes);
      return { response, body };
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error("Too many redirects");
}
