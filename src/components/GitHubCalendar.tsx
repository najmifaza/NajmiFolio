"use client";

import { useTheme } from "@once-ui-system/core";
import dynamic from "next/dynamic";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
  },
);

export const GitHubContribution: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;

    const scrollToRight = () => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = el.scrollWidth;
      }
    };

    // Attempt immediately and whenever child elements mutate (calendar rendered)
    scrollToRight();

    const observer = new MutationObserver(() => {
      scrollToRight();
    });

    observer.observe(el, { childList: true, subtree: true });

    // Fallback timers for async chart data load
    const t1 = setTimeout(scrollToRight, 300);
    const t2 = setTimeout(scrollToRight, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div style={{ minWidth: "max-content", display: "inline-block" }}>
        <GitHubCalendar
          username="najmifaza"
          colorScheme={theme === "dark" ? "dark" : "light"}
          fontSize={10}
          blockSize={8}
          blockMargin={4}
          year="last"
        />
      </div>
    </div>
  );
};
