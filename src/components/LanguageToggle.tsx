"use client";

import { ToggleButton } from "@once-ui-system/core";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const nextLanguage = language === "id" ? "en" : "id";
  const buttonLabel = language === "id" ? "ID" : "EN";

  return (
    <ToggleButton
      label={buttonLabel}
      onClick={() => setLanguage(nextLanguage)}
      aria-label={`Switch to ${nextLanguage === "en" ? "English" : "Indonesian"}`}
    />
  );
}
