"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Locale, Dictionary } from "@/resources/i18n";

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage,
  initialDictionary,
}: {
  children: React.ReactNode;
  initialLanguage: Locale;
  initialDictionary: Dictionary;
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();

  // Detect language from URL path if present
  const derivedLang: Locale = pathname.startsWith("/en") ? "en" : initialLanguage;
  const [language, setLangState] = useState<Locale>(derivedLang);

  useEffect(() => {
    if (pathname.startsWith("/en")) {
      setLangState("en");
    } else {
      setLangState(initialLanguage);
    }
  }, [pathname, initialLanguage]);

  const setLanguage = (lang: Locale) => {
    setLangState(lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;

    let newPath = pathname;
    if (lang === "en") {
      if (!pathname.startsWith("/en")) {
        newPath = pathname === "/" ? "/en" : `/en${pathname}`;
      }
    } else {
      if (pathname.startsWith("/en")) {
        const stripped = pathname.slice(3);
        newPath = stripped.startsWith("/") ? stripped : `/${stripped}`;
        if (!newPath) newPath = "/";
      }
    }

    router.push(newPath);
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dict: initialDictionary }}>
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
