"use client";

import { toggleLocalePath } from "@/lib/locale-path";
import { ToggleButton } from "@once-ui-system/core";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const pathname = usePathname() ?? "/";
  const { language } = useLanguage();

  const nextLanguage = language === "id" ? "en" : "id";

  return (
    <ToggleButton
      prefixIcon={language === "id" ? "circle-flags:id" : "circle-flags:gb"}
      label={language === "id" ? "ID" : "EN"}
      href={toggleLocalePath(pathname, language)}
      aria-label={`Switch to ${nextLanguage === "en" ? "English" : "Indonesian"}`}
    />
  );
}
