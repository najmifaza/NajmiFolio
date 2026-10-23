"use client";

import { isEnglishPath } from "@/lib/locale-path";
import type { Dictionary, Locale } from "@/resources/i18n";
import { usePathname } from "next/navigation";
import type React from "react";
import { createContext, useContext } from "react";

interface LanguageContextType {
  language: Locale;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// The URL is the only source of truth for the locale. No state, no cookie
// writes: navigating between /about and /en/about re-renders the [locale]
// layout, which hands this provider the matching dictionary.
export function LanguageProvider({
  children,
  initialDictionary,
}: {
  children: React.ReactNode;
  initialDictionary: Dictionary;
}) {
  const pathname = usePathname() || "/";
  const language: Locale = isEnglishPath(pathname) ? "en" : "id";

  return (
    <LanguageContext.Provider value={{ language, dict: initialDictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useDictionary() {
  const { dict } = useLanguage();
  return dict;
}
