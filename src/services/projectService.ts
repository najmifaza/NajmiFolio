import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/resources/i18n";

export interface ProjectData {
  slug: string;
  content: string;
  metadata: {
    title: string;
    subtitle?: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images: string[];
    tag?: string;
    team: Array<{
      name: string;
      role: string;
      avatar: string;
      linkedIn: string;
    }>;
    link?: string;
    github?: string;
  };
}

const projectsMemCache: { [key in Locale]?: { data: ProjectData[]; timestamp: number } } = {};
const projectSlugMemCache: { [key: string]: { data: ProjectData | null; timestamp: number } } = {};
const CACHE_TTL_MS = 30_000;

export function invalidateProjectCache() {
  projectsMemCache.id = undefined;
  projectsMemCache.en = undefined;
  for (const k of Object.keys(projectSlugMemCache)) {
    delete projectSlugMemCache[k];
  }
}

export const getProjectsFromDB = cache(async (locale: Locale = "id"): Promise<ProjectData[]> => {
  const now = Date.now();
  if (projectsMemCache[locale] && now - projectsMemCache[locale]!.timestamp < CACHE_TTL_MS) {
    return projectsMemCache[locale]!.data;
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      include: {
        translations: true,
      },
    });

    if (!projects || projects.length === 0) return [];

    const mapped = projects.map((p) => {
      const trans =
        p.translations.find((t) => t.locale === locale) ||
        p.translations.find((t) => t.locale === "id") ||
        p.translations[0];

      const images = (p.images as string[]) || [];

      return {
        slug: p.slug,
        content: trans?.content || "",
        metadata: {
          title: trans?.title || p.slug,
          publishedAt: p.publishedAt ? p.publishedAt.toISOString().split("T")[0] : "",
          summary: trans?.summary || "",
          image: images[0] || "",
          images: images,
          link: p.link || "",
          github: p.github || "",
          team: [
            {
              name: "Najmi Faza",
              role: "Full-Stack Web Developer",
              avatar: "/images/avatar.png",
              linkedIn: "https://www.linkedin.com/in/adridinan-najmi-faza-80b88a301/",
            },
          ],
        },
      };
    });

    projectsMemCache[locale] = { data: mapped, timestamp: now };
    return mapped;
  } catch (error) {
    if (projectsMemCache[locale]) {
      return projectsMemCache[locale]!.data;
    }
    return [];
  }
});

export const getProjectBySlugFromDB = cache(
  async (slug: string, locale: Locale = "id"): Promise<ProjectData | null> => {
    const cacheKey = `${slug}_${locale}`;
    const now = Date.now();

    if (projectSlugMemCache[cacheKey] && now - projectSlugMemCache[cacheKey].timestamp < CACHE_TTL_MS) {
      return projectSlugMemCache[cacheKey].data;
    }

    try {
      const p = await prisma.project.findUnique({
        where: { slug },
        include: {
          translations: true,
        },
      });

      if (!p) return null;

      let trans = p.translations.find((t) => t.locale === locale);
      if (!trans) {
        trans = p.translations.find((t) => t.locale === "id") || p.translations[0];
      }

      const images = (p.images as string[]) || [];

      const result: ProjectData = {
        slug: p.slug,
        content: trans?.content || "",
        metadata: {
          title: trans?.title || p.slug,
          publishedAt: p.publishedAt ? p.publishedAt.toISOString().split("T")[0] : "",
          summary: trans?.summary || "",
          image: images[0] || "",
          images: images,
          link: p.link || "",
          github: p.github || "",
          team: [
            {
              name: "Najmi Faza",
              role: "Full-Stack Web Developer",
              avatar: "/images/avatar.png",
              linkedIn: "https://www.linkedin.com/in/adridinan-najmi-faza-80b88a301/",
            },
          ],
        },
      };

      projectSlugMemCache[cacheKey] = { data: result, timestamp: now };
      return result;
    } catch (error) {
      if (projectSlugMemCache[cacheKey]) {
        return projectSlugMemCache[cacheKey].data;
      }
      return null;
    }
  }
);
