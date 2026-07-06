"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [language, setLangState] = useState<Locale>(initialLanguage);
  const router = useRouter();

  const setLanguage = (lang: Locale) => {
    setLangState(lang);
    // Save in cookie (1 year)
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
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
