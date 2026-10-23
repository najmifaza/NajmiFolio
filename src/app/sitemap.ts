import { baseURL, routes as routesConfig } from "@/resources";
import { getPostsForCurrentLocale } from "@/utils/utils";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const normalizedBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;

  const posts = await getPostsForCurrentLocale(["src", "app", "project", "projects"]);

  const projectEntries: MetadataRoute.Sitemap = [];
  for (const post of posts) {
    const idUrl = `${normalizedBaseURL}/project/${post.slug}`;
    const enUrl = `${normalizedBaseURL}/en/project/${post.slug}`;

    projectEntries.push({
      url: idUrl,
      lastModified: post.metadata.publishedAt || new Date().toISOString(),
      alternates: {
        languages: {
          id: idUrl,
          en: enUrl,
        },
      },
    });

    projectEntries.push({
      url: enUrl,
      lastModified: post.metadata.publishedAt || new Date().toISOString(),
      alternates: {
        languages: {
          id: idUrl,
          en: enUrl,
        },
      },
    });
  }

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const staticEntries: MetadataRoute.Sitemap = [];
  for (const route of activeRoutes) {
    const path = route === "/" ? "" : route;
    const idUrl = `${normalizedBaseURL}${path}`;
    const enUrl = `${normalizedBaseURL}/en${path}`;

    staticEntries.push({
      url: idUrl,
      lastModified: new Date().toISOString().split("T")[0],
      alternates: {
        languages: {
          id: idUrl,
          en: enUrl,
        },
      },
    });

    staticEntries.push({
      url: enUrl,
      lastModified: new Date().toISOString().split("T")[0],
      alternates: {
        languages: {
          id: idUrl,
          en: enUrl,
        },
      },
    });
  }

  return [...staticEntries, ...projectEntries];
}
