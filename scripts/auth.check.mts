// Run: npx tsx scripts/auth.check.mts
import assert from "node:assert/strict";
import { createAuthToken, safeEqual, verifyAuthToken } from "../src/lib/auth.ts";

// fail-closed: no secret -> deny, never a default key
Reflect.deleteProperty(process.env, "PAGE_ACCESS_PASSWORD");
assert.equal(await verifyAuthToken("1.a.b"), false, "missing secret must deny");
await assert.rejects(() => createAuthToken(), /PAGE_ACCESS_PASSWORD is not set/);

process.env.PAGE_ACCESS_PASSWORD = "correct-horse";

// valid roundtrip
const token = await createAuthToken();
assert.equal(await verifyAuthToken(token), true, "fresh token must verify");
assert.equal(token.split(".").length, 3, "token is timestamp.nonce.hmac");

// uniqueness (nonce) — two tokens minted in the same millisecond must differ
const [a, b] = await Promise.all([createAuthToken(), createAuthToken()]);
assert.notEqual(a, b, "tokens must be unique");

// legacy 2-part token no longer accepted
const ts = Date.now().toString();
assert.equal(await verifyAuthToken(`${ts}.deadbeef`), false, "legacy token rejected");

// tamper / expiry / garbage
const [t, nonce, sig] = token.split(".");
assert.equal(await verifyAuthToken(`${t}.${nonce}.${sig.slice(0, -1)}0`), false, "tampered sig");
assert.equal(await verifyAuthToken(`${Number(t) - 8 * 864e5}.${nonce}.${sig}`), false, "expired");
assert.equal(await verifyAuthToken("nonsense"), false);
assert.equal(await verifyAuthToken(""), false);
assert.equal(await verifyAuthToken(null), false);

// constant-time compare helper
assert.equal(safeEqual("abc", "abc"), true);
assert.equal(safeEqual("abc", "abd"), false);
assert.equal(safeEqual("abc", "abcd"), false);

console.log("auth.ts ok");
