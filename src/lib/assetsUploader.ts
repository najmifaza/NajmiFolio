interface UploadResponse {
  status: "success" | "error";
  filename?: string;
  url?: string;
  message?: string;
}

export async function uploadAsset(
  fileBlob: Blob,
  fileName: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  // Prefer project ref directly from DATABASE_URL if available to prevent host mismatch
  let supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const dbUrl = process.env.DATABASE_URL || "";
  const match = dbUrl.match(/postgres(?:ql)?:\/\/postgres\.([a-z0-9]+):/i);
  if (match?.[1]) {
    supabaseUrl = `https://${match[1]}.supabase.co`;
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "bucket_portofolio";

  // 1. Supabase Storage (Preferred)
  if (supabaseUrl && serviceKey) {
    try {
      const ext = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() || "" : "";
      const baseName = fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 40);

      const uniqueSuffix = Math.random().toString(36).substring(2, 10);
      const storageFileName = ext
        ? `${Date.now()}-${uniqueSuffix}-${baseName}.${ext}`
        : `${Date.now()}-${uniqueSuffix}-${baseName}`;

      const storagePath = `uploads/${storageFileName}`;
      const uploadEndpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${storagePath}`;

      let contentType = fileBlob.type || "application/octet-stream";
      if (ext === "webm") contentType = "video/webm";
      else if (ext === "webp") contentType = "image/webp";
      else if (ext === "png") contentType = "image/png";
      else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";

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
