import { baseURL } from "@/resources";

export const dynamic = "force-static";

export default function robots() {
  const normalizedBaseURL = baseURL.endsWith("/")
    ? baseURL.slice(0, -1)
    : baseURL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/authenticate", "/api/check-auth"],
      },
    ],
    host: normalizedBaseURL,
    sitemap: `${normalizedBaseURL}/sitemap.xml`,
  };
}
