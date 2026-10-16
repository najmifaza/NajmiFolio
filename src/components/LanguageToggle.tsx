"use client";

import { ToggleButton } from "@once-ui-system/core";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const nextLanguage = language === "id" ? "en" : "id";
  const flagIcon = language === "id" ? "circle-flags:id" : "circle-flags:gb";
  const buttonLabel = language === "id" ? "ID" : "EN";

  return (
    <ToggleButton
      prefixIcon={flagIcon}
      label={buttonLabel}
      onClick={() => setLanguage(nextLanguage)}
      aria-label={`Switch to ${nextLanguage === "en" ? "English" : "Indonesian"}`}
    />
  );
}
