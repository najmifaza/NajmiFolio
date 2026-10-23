// Run: npx tsx scripts/ssrf.check.mts
import assert from "node:assert/strict";
import { assertPublicHttpUrl, isBlockedIp, safeFetchBytes } from "../src/lib/ssrf.ts";

const blocked = [
  "127.0.0.1",
  "127.9.9.9",
  "10.0.0.1",
  "172.20.0.1",
  "192.168.1.1",
  "169.254.169.254", // cloud metadata
  "100.64.0.1", // CGNAT
  "0.0.0.0",
  "0.0.0.1",
  "224.0.0.1",
  "255.255.255.255",
  "::1",
  "::",
  "fe80::1",
  "fc00::1",
  "fd12:3456::1",
  "::ffff:127.0.0.1",
];
for (const ip of blocked) assert.equal(isBlockedIp(ip), true, `${ip} must be blocked`);

const allowed = ["8.8.8.8", "1.1.1.1", "93.184.216.34", "2001:4860:4860::8888"];
for (const ip of allowed) assert.equal(isBlockedIp(ip), false, `${ip} must be allowed`);

const badUrls = [
  "http://localhost/",
  "http://localhost./",
  "http://foo.localhost/",
  "http://service.internal/",
  "http://127.0.0.1:8080/",
  "http://[::1]/",
  "http://169.254.169.254/latest/meta-data/",
  "http://2130706433/", // decimal-encoded 127.0.0.1
  "http://0x7f000001/", // hex-encoded 127.0.0.1
  "http://0177.0.0.1/", // octal-looking
  "file:///etc/passwd",
  "gopher://example.com/",
  "http://user:pass@example.com/",
  "not a url",
];
for (const url of badUrls) {
  await assert.rejects(() => assertPublicHttpUrl(url), `${url} must be rejected`);
}

// Public IP literal: allowed without any DNS lookup.
assert.equal((await assertPublicHttpUrl("https://1.1.1.1/")).hostname, "1.1.1.1");

// The guard is wired into the fetch path, not just the string check.
await assert.rejects(() => safeFetchBytes("http://169.254.169.254/"), /Blocked address/);
await assert.rejects(() => safeFetchBytes("http://localhost:3000/api"), /Blocked hostname/);

console.log("ssrf.ts ok");
