interface UploadResponse {
  status: "success" | "error";
  filename?: string;
  url?: string;
  message?: string;
}

export async function uploadAsset(
  fileBlob: Blob,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const uploadUrl = process.env.ASSETS_UPLOAD_URL;
  const token = process.env.ASSETS_BEARER_TOKEN;

  if (!uploadUrl || !token) {
    return {
      success: false,
      error: "ASSETS_UPLOAD_URL or ASSETS_BEARER_TOKEN is not configured in environment.",
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
