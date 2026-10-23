import { getDynamicDictionary } from "@/services/contentService";
import { cookies } from "next/headers";
import * as enDict from "./en";
import * as idDict from "./id";

// Convert module namespace objects to plain objects so they can be passed to Client Components
const idPlain = { ...idDict };
const enPlain = { ...enDict };

export const dictionaries = {
  id: idPlain,
  en: enPlain,
};

export type Locale = "id" | "en";
export type Dictionary = typeof idPlain;

export async function getDictionary(localeParam?: Locale): Promise<Dictionary> {
  let locale = localeParam;
  if (!locale) {
    try {
      const cookieStore = await cookies();
      locale = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined;
    } catch {
      locale = "id";
    }
  }
  const validLocale: Locale = locale === "en" ? "en" : "id";
  return getDynamicDictionary(validLocale);
}
