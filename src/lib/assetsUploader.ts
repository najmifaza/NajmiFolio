interface UploadResponse {
  status: "success" | "error";
  filename?: string;
  url?: string;
  message?: string;
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

// Extension and client-supplied Content-Type are both attacker-controlled, so the
// stored object's type is decided by magic bytes only.
export function detectFileType(head: Uint8Array): string | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...head.slice(from, to));

  if (head[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "jpeg";
  if (ascii(0, 4) === "GIF8") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(0, 4) === "%PDF") return "pdf";
  if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) return "webm";
  if (ascii(4, 8) === "ftyp") return "mp4";
  return null;
}

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  pdf: "application/pdf",
  webm: "video/webm",
  mp4: "video/mp4",
};

export async function uploadAsset(
  fileBlob: Blob,
  fileName: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (fileBlob.size === 0) {
    return { success: false, error: "File is empty." };
  }
  if (fileBlob.size > MAX_UPLOAD_BYTES) {
    return { success: false, error: "File exceeds the 10 MB upload limit." };
  }

  const head = new Uint8Array(await fileBlob.slice(0, 12).arrayBuffer());
  const detected = detectFileType(head);
  if (!detected) {
    return { success: false, error: "Unsupported file type." };
  }

  const ext = detected;
  const contentType = CONTENT_TYPES[detected];

  // Explicit config only. Deriving the project ref from DATABASE_URL used to
  // silently override NEXT_PUBLIC_SUPABASE_URL and broke on non-Supabase hosts.
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(
    /\/$/,
    "",
  );

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "bucket_portofolio";

  // 1. Supabase Storage (Preferred)
  if (supabaseUrl && serviceKey) {
    try {
      const baseName = fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 40);

      const uniqueSuffix = Math.random().toString(36).substring(2, 10);
      const storageFileName = `${Date.now()}-${uniqueSuffix}-${baseName}.${ext}`;

      const storagePath = `uploads/${storageFileName}`;
      const uploadEndpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${storagePath}`;

      const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": contentType,
          "x-upsert": "true",
        },
        body: fileBuffer,
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          success: false,
          error: `Supabase Storage HTTP ${res.status}: ${errText}`,
        };
      }

      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
      return { success: true, url: publicUrl };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  const uploadUrl = process.env.ASSETS_UPLOAD_URL;
  const token = process.env.ASSETS_BEARER_TOKEN;

  if (!uploadUrl || !token) {
    return {
      success: false,
      error: "Neither Supabase Storage nor legacy ASSETS_UPLOAD_URL is configured.",
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", fileBlob, fileName);

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Upload HTTP ${res.status}: ${errText}` };
    }

    const data: UploadResponse = await res.json();
    if (data.status === "success" && data.url) {
      return { success: true, url: data.url };
    }

    return {
      success: false,
      error: data.message || "Upload failed without explicit error.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
