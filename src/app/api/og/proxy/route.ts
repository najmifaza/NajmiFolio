import { safeFetchBytes } from "@/lib/ssrf";
import { type NextRequest, NextResponse } from "next/server";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function GET(request: NextRequest) {
  try {
    const imageUrl = new URL(request.url).searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
    }

    const { response, body } = await safeFetchBytes(imageUrl, {
      maxBytes: MAX_IMAGE_BYTES,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status },
      );
    }

    // Only proxy real images — keeps this from being a general-purpose open proxy.
    const contentType = response.headers.get("content-type")?.split(";")[0].trim() ?? "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Target is not an image" }, { status: 415 });
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.byteLength),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to proxy image";
    const status = message === "Response too large" ? 413 : 502;
    console.error("Error proxying image:", message);
    return NextResponse.json({ error: message }, { status });
  }
}
