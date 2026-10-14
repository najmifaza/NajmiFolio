import translate from "@iamtraction/google-translate";

export async function autoTranslate(text: string, from = "id", to = "en"): Promise<string> {
  if (!text || !text.trim()) return text;
  try {
    const res = await translate(text, { from, to });
    return res.text;
  } catch (err) {
    console.error("Auto-translation service error, falling back to original:", err);
    return text;
  }
}
