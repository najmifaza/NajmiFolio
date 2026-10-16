import { prisma } from "@/lib/prisma";
import type { Dictionary, Locale } from "@/resources/i18n";
import * as enDict from "@/resources/i18n/en";
import * as idDict from "@/resources/i18n/id";
import type { IconName } from "@/resources/icons";
import type { IANATimeZone } from "@/types";
import { cache } from "react";

const idPlain = { ...idDict };
const enPlain = { ...enDict };

// In-memory cache on globalThis for fast dev/prod responses without spamming DB
declare global {
  var __contentMemCache: { [key in Locale]?: { data: Dictionary; timestamp: number } } | undefined;
}

if (!globalThis.__contentMemCache) {
  globalThis.__contentMemCache = {};
}
const memCache = globalThis.__contentMemCache;
const CACHE_TTL_MS = 60_000; // 1 minute (invalidated on CMS actions)

export function invalidateContentCache() {
  if (globalThis.__contentMemCache) {
    globalThis.__contentMemCache.id = undefined;
    globalThis.__contentMemCache.en = undefined;
  }
}

export const getDynamicDictionary = cache(async (locale: Locale = "id"): Promise<Dictionary> => {
  const baseDict = locale === "en" ? enPlain : idPlain;
  const now = Date.now();

  if (memCache[locale] && now - memCache[locale]?.timestamp < CACHE_TTL_MS) {
    return memCache[locale]?.data;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: "default" },
      include: {
        translations: true,
        socialLinks: { orderBy: { order: "asc" } },
        experiences: {
          include: { translations: true },
          orderBy: { order: "asc" },
        },
        studies: {
          include: { translations: true },
          orderBy: { order: "asc" },
        },
        skills: {
          include: { translations: true },
          orderBy: { order: "asc" },
        },
        certificates: { orderBy: { order: "asc" } },
      },
    });

    if (!profile) return baseDict;

    const pTrans =
      profile.translations.find((t) => t.locale === locale) ||
      profile.translations.find((t) => t.locale === "id") ||
      profile.translations[0];

    const fullName = pTrans?.name ?? baseDict.person.name;
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || baseDict.person.firstName;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : fullName;

    const person = {
      ...baseDict.person,
      name: fullName,
      firstName,
      lastName,
      role: pTrans?.role ?? baseDict.person.role,
      avatar: profile.avatar || baseDict.person.avatar,
      email: profile.email || baseDict.person.email,
      location: (profile.location as IANATimeZone) || baseDict.person.location,
      languages: (profile.languages as string[]) || baseDict.person.languages,
    };

    const social =
      profile.socialLinks.length > 0
        ? profile.socialLinks.map((s) => ({
            name: s.name,
            icon: s.icon as IconName,
            link: s.link,
            essential: s.essential,
          }))
        : baseDict.social;

    const home = {
      ...baseDict.home,
      title: pTrans?.name ? `${pTrans.name} | Portfolio` : baseDict.home.title,
      headline: pTrans?.headline ?? baseDict.home.headline,
      subline: pTrans?.subline ?? baseDict.home.subline,
    };

    // Split experiences: 1-8 are work, 9+ are committee / organization
    const workExps = profile.experiences.filter((e) => e.order <= 8);
    const orgExps = profile.experiences.filter((e) => e.order > 8);

    const mapExp = (e: (typeof profile.experiences)[0]) => {
      const eTrans =
        e.translations.find((t) => t.locale === locale) ||
        e.translations.find((t) => t.locale === "id") ||
        e.translations[0];
      return {
        company: e.company,
        timeframe: e.timeframe,
        role: eTrans?.role ?? "",
        achievements: (eTrans?.achievements as string[]) || [],
        images: e.images
          ? (
              e.images as Array<{
                src: string;
                alt?: string;
                width?: number;
                height?: number;
              }>
            ).map((img) => ({
              src: typeof img === "string" ? img : img.src,
              alt: (typeof img === "object" && img.alt) || e.company,
              width: (typeof img === "object" && img.width) || 600,
              height: (typeof img === "object" && img.height) || 400,
            }))
          : undefined,
      };
    };

    const about = {
      ...baseDict.about,
      title: pTrans?.aboutTitle ?? baseDict.about.title,
      description: pTrans?.aboutDesc ?? baseDict.about.description,
      intro: {
        ...baseDict.about.intro,
        description: pTrans?.intro ?? baseDict.about.intro.description,
      },
      work: {
        ...baseDict.about.work,
        experiences: workExps.length > 0 ? workExps.map(mapExp) : baseDict.about.work.experiences,
      },
      Organization: {
        ...baseDict.about.Organization,
        experiences:
          orgExps.length > 0 ? orgExps.map(mapExp) : baseDict.about.Organization.experiences,
      },
      studies: {
        ...baseDict.about.studies,
        institutions:
          profile.studies.length > 0
            ? profile.studies.map((st) => {
                const stTrans =
                  st.translations.find((t) => t.locale === locale) ||
                  st.translations.find((t) => t.locale === "id") ||
                  st.translations[0];
                return {
                  name: st.institution,
                  description: stTrans?.degree || stTrans?.description || "",
                };
              })
            : baseDict.about.studies.institutions,
      },
      technical: {
        ...baseDict.about.technical,
        skills:
          profile.skills.length > 0
            ? profile.skills.map((sg) => {
                const sgTrans =
                  sg.translations.find((t) => t.locale === locale) ||
                  sg.translations.find((t) => t.locale === "id") ||
                  sg.translations[0];
                return {
                  title: sgTrans?.title || sg.title,
                  description: sgTrans?.description || "",
                  tags: Array.isArray(sg.skills)
                    ? (sg.skills as Array<string | { name: string; icon?: string }>).map((t) => {
                        const name = typeof t === "string" ? t : t.name;
                        const icon = typeof t === "object" && t.icon ? t.icon : name;
                        return { name, icon };
                      })
                    : [],
                };
              })
            : baseDict.about.technical.skills,
      },
    };

    const licenses = {
      ...baseDict.licenses,
      certificates:
        profile.certificates.length > 0
          ? profile.certificates.map((c) => ({
              title: c.title,
              issuer: c.issuer,
              date: c.date,
              image: c.image,
              url: c.url || undefined,
            }))
          : baseDict.licenses.certificates,
    };

    const result = {
      ...baseDict,
      person,
      social,
      home,
      about,
      licenses,
    };

    memCache[locale] = { data: result, timestamp: now };
    return result;
  } catch (err) {
    // If DB is temporarily busy/exhausted, serve previous cached data or static fallback
    if (memCache[locale]) {
      return memCache[locale]?.data;
    }
    return baseDict;
  }
});
