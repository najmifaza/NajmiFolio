// The default locale is served through a middleware rewrite to /id/*, so
// server-rendered HTML sees /id/about while the address bar shows /about.
// Normalise both shapes to the public path before comparing.
export function normalizeLocalePath(pathname: string): string {
  return pathname.replace(/^\/id(?=\/|$)/, "") || "/";
}

// `/en` and `/en/*` are English; everything else (including `/english`) is the
// default locale. Segment-aware so `/entry` is never mistaken for `/en`.
export function isEnglishPath(pathname: string): boolean {
  const path = normalizeLocalePath(pathname);
  return path === "/en" || path.startsWith("/en/");
}

export function toggleLocalePath(pathname: string, language: "id" | "en"): string {
  const path = normalizeLocalePath(pathname);
  if (language === "id") {
    return path === "/" ? "/en" : `/en${path}`;
  }
  return path.replace(/^\/en(?=\/|$)/, "") || "/";
}
