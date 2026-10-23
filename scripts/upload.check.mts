// Run: npx tsx scripts/upload.check.mts
import assert from "node:assert/strict";
import { detectFileType } from "../src/lib/assetsUploader.ts";

const head = (...bytes: (number | string)[]) =>
  new Uint8Array(
    bytes.flatMap((b) => (typeof b === "number" ? [b] : Array.from(b, (c) => c.charCodeAt(0)))),
  );

assert.equal(detectFileType(head(0x89, "PNG", 0x0d, 0x0a)), "png");
assert.equal(detectFileType(head(0xff, 0xd8, 0xff, 0xe0)), "jpeg");
assert.equal(detectFileType(head("GIF8", "9a")), "gif");
// WEBP is RIFF....WEBP: the signature sits at offset 8, not 0.
assert.equal(detectFileType(head("RIFF", 0, 0, 0, 0, "WEBP")), "webp");
assert.equal(detectFileType(head("%PDF", "-1.7")), "pdf");
assert.equal(detectFileType(head(0x1a, 0x45, 0xdf, 0xa3)), "webm");
// MP4 is ftyp at offset 4.
assert.equal(detectFileType(head(0, 0, 0, 0x20, "ftyp", "isom")), "mp4");

// A renamed executable / script must not pass, whatever the filename says.
assert.equal(detectFileType(head("MZ", 0x90, 0x00)), null);
assert.equal(detectFileType(head("#!/bin/sh")), null);
assert.equal(detectFileType(head("<svg xmlns=")), null);
assert.equal(detectFileType(head("<html>")), null);
assert.equal(detectFileType(new Uint8Array(0)), null);

console.log("assetsUploader.ts ok");
