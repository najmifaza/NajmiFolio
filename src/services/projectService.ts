import { prisma } from "@/lib/prisma";
import type { Locale } from "@/resources/i18n";
import { getDynamicDictionary } from "@/services/contentService";
import { cache } from "react";

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

// Team comes from the profile row, not a hardcoded literal — one source of truth
// for name/role/avatar/LinkedIn. ponytail: single-owner portfolio, so the team is
// always the profile owner. Add a Team model when projects need real co-authors.
async function getTeam(locale: Locale): Promise<ProjectData["metadata"]["team"]> {
  const { person, social } = await getDynamicDictionary(locale);
  const linkedIn = social.find((s) => s.name.toLowerCase().includes("linkedin"))?.link ?? "";

  return [
    {
      name: person.name,
      role: person.role,
      avatar: person.avatar,
      linkedIn,
    },
  ];
}

// Cache lives on globalThis so dev HMR and multiple module instances share one entry.
declare global {
  var __projectMemCache:
    | {
        list: { [key in Locale]?: { data: ProjectData[]; timestamp: number } };
        slug: { [key: string]: { data: ProjectData | null; timestamp: number } };
      }
    | undefined;
}

if (!globalThis.__projectMemCache) {
  globalThis.__projectMemCache = { list: {}, slug: {} };
}
const memCache = globalThis.__projectMemCache;

const CACHE_TTL_MS = 300_000; // 5 minutes (invalidated on CMS actions)
const MAX_SLUG_CACHE_ENTRIES = 200;

function setSlugCache(key: string, value: { data: ProjectData | null; timestamp: number }) {
  const keys = Object.keys(memCache.slug);
  if (keys.length >= MAX_SLUG_CACHE_ENTRIES) {
    let oldestKey = keys[0];
    let oldestTime = memCache.slug[oldestKey].timestamp;
    for (const k of keys) {
      if (memCache.slug[k].timestamp < oldestTime) {
        oldestTime = memCache.slug[k].timestamp;
        oldestKey = k;
      }
    }
    delete memCache.slug[oldestKey];
  }
  memCache.slug[key] = value;
}

export function invalidateProjectCache() {
  memCache.list.id = undefined;
  memCache.list.en = undefined;
  for (const k of Object.keys(memCache.slug)) {
    delete memCache.slug[k];
  }
}

export const getProjectsFromDB = cache(async (locale: Locale = "id"): Promise<ProjectData[]> => {
  const now = Date.now();
  const cached = memCache.list[locale];
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const [projects, team] = await Promise.all([
      prisma.project.findMany({
        orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
        include: {
          translations: true,
        },
      }),
      getTeam(locale),
    ]);

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
          team,
        },
      };
    });

    memCache.list[locale] = { data: mapped, timestamp: now };
    return mapped;
  } catch (error) {
    console.error("[projects] DB read failed:", error instanceof Error ? error.message : error);
    if (memCache.list[locale]) {
      return memCache.list[locale].data;
    }
    return [];
  }
});

export const getProjectBySlugFromDB = cache(
  async (slug: string, locale: Locale = "id"): Promise<ProjectData | null> => {
    const cacheKey = `${slug}_${locale}`;
    const now = Date.now();
    const cached = memCache.slug[cacheKey];

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const [p, team] = await Promise.all([
        prisma.project.findUnique({
          where: { slug },
          include: {
            translations: true,
          },
        }),
        getTeam(locale),
      ]);

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
          team,
        },
      };

      setSlugCache(cacheKey, { data: result, timestamp: now });
      return result;
    } catch (error) {
      console.error("[projects] slug read failed:", error instanceof Error ? error.message : error);
      if (memCache.slug[cacheKey]) {
        return memCache.slug[cacheKey].data;
      }
      return null;
    }
  },
);
