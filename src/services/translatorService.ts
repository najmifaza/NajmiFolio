function cleanMarkdownArtifacts(str: string): string {
  return str
    .replace(/\*\s+\*/g, "**")
    .replace(/\*\*\s+/g, "** ")
    .replace(/\s+\*\*/g, " **");
}

async function fetchMyMemory(chunk: string, from: string, to: string): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${from}|${to}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.responseData?.translatedText && data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
  } catch {}
  return null;
}

async function translateSingleSentence(text: string, from: string, to: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // If text is short enough (<= 450 chars)
  if (trimmed.length <= 450) {
    const res = await fetchMyMemory(trimmed, from, to);
    if (res) return cleanMarkdownArtifacts(res);
  } else {
    // Split long paragraph by sentence boundaries (. , ! ?)
    const sentences = trimmed.split(/(?<=[.!?])\s+/);
    const translatedParts: string[] = [];
    for (const s of sentences) {
      const part = s.trim();
      if (!part) continue;
      const res = await fetchMyMemory(part, from, to);
      translatedParts.push(res ? cleanMarkdownArtifacts(res) : part);
    }
    return translatedParts.join(" ");
  }

  return text;
}

export async function autoTranslate(text: string, from = "id", to = "en"): Promise<string> {
  if (!text || !text.trim()) return text;

  // Single short line (e.g. Title or Role)
  if (!text.includes("\n") && text.length <= 450) {
    return translateSingleSentence(text, from, to);
  }

  // Multi-line or Markdown document
  const lines = text.split("\n");
  const resultLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      resultLines.push(line);
      continue;
    }

    // Preserve markdown headers e.g. "## 1. Problem"
    const headerMatch = line.match(/^(\s*#{1,6}\s+)(.*)$/);
    if (headerMatch) {
      const [, prefix, content] = headerMatch;
      const transContent = await translateSingleSentence(content, from, to);
      resultLines.push(`${prefix}${transContent}`);
      continue;
    }

    // Preserve list items e.g. "- **Problem:** ..." or "* ..."
    const listMatch = line.match(/^(\s*[-*+]\s+)(.*)$/);
    if (listMatch) {
      const [, prefix, content] = listMatch;
      const transContent = await translateSingleSentence(content, from, to);
      resultLines.push(`${prefix}${transContent}`);
      continue;
    }

    // Preserve blockquotes e.g. "> ..."
    const quoteMatch = line.match(/^(\s*>\s+)(.*)$/);
    if (quoteMatch) {
      const [, prefix, content] = quoteMatch;
      const transContent = await translateSingleSentence(content, from, to);
      resultLines.push(`${prefix}${transContent}`);
      continue;
    }

    // Regular line / paragraph
    const transLine = await translateSingleSentence(line, from, to);
    resultLines.push(transLine);
  }

  return resultLines.join("\n");
}
