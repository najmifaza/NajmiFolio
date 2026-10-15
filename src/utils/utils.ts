import type { Locale } from "@/resources/i18n";
import { type ProjectData, getProjectsFromDB } from "@/services/projectService";
import { cookies } from "next/headers";

export async function getPostsForCurrentLocale(
  _customPath = ["", "", "", ""],
  forcedLocale?: Locale,
): Promise<ProjectData[]> {
  let locale: Locale = forcedLocale || "id";
  if (!forcedLocale) {
    try {
      const cookieStore = await cookies();
      locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) ?? "id";
    } catch {
      locale = "id";
    }
  }

  try {
    const dbProjects = await getProjectsFromDB(locale);
    return dbProjects || [];
  } catch (err) {
    console.error("DB query failed in getPostsForCurrentLocale:", err);
    return [];
  }
}

export async function getPosts(
  _customPath = ["", "", "", ""],
  locale?: string,
): Promise<ProjectData[]> {
  return getPostsForCurrentLocale(_customPath, locale === "en" ? "en" : "id");
}
