import * as idDict from "./id";
import * as enDict from "./en";
import { cookies } from "next/headers";

// Convert module namespace objects to plain objects so they can be passed to Client Components
const idPlain = { ...idDict };
const enPlain = { ...enDict };

export const dictionaries = {
  id: idPlain,
  en: enPlain,
};

export type Locale = "id" | "en";
export type Dictionary = typeof idPlain;

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined;
  return locale === "en" ? enPlain : idPlain;
}
