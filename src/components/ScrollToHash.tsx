"use client";

import { useEffect } from "react";

export function ScrollToHash() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToHash();
    // Hash-only navigation doesn't remount the page, so listen for it directly.
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
