"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Column, Text, RevealFx, useTheme } from "@once-ui-system/core";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
  },
);

export const GitHubContribution: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <GitHubCalendar
        username="najmifaza"
        colorScheme={theme === "dark" ? "dark" : "light"}
        fontSize={10}
        blockSize={8}
        blockMargin={4}
      />
    </div>
  );
};
