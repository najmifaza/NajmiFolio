"use client";

import type { Dictionary, Locale } from "@/resources/i18n";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

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
  dictionaries,
}: {
  children: React.ReactNode;
  initialLanguage: Locale;
  initialDictionary: Dictionary;
  dictionaries?: { id: Dictionary; en: Dictionary };
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

    // Prefetch alternate language route for instant switching
    const targetPath = pathname.startsWith("/en")
      ? pathname.slice(3) || "/"
      : pathname === "/"
        ? "/en"
        : `/en${pathname}`;
    router.prefetch(targetPath);
  }, [pathname, initialLanguage, router]);

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
  };

  const activeDict = dictionaries ? dictionaries[language] || initialDictionary : initialDictionary;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dict: activeDict }}>
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
