import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import { Providers } from "@/components";
import { Background, Column, Flex, RevealFx } from "@once-ui-system/core";
import { fonts, style, effects, dataStyle } from "@/resources";
import type { Metadata } from "next";
import classNames from "classnames";
import type { SpacingToken, opacity } from "@once-ui-system/core";

export const metadata: Metadata = {
  title: "Admin Dashboard | Najmi Folio",
  robots: { index: false, follow: false },
};

// Admin lives outside the [locale] tree — own root layout.
// Visual identity mirrors the public [locale] layout: same font vars,
// same theme-init script, same Background effects, same Once UI tokens.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="id"
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <script id="theme-init">{`
          (function() {
            try {
              var root = document.documentElement;
              var config = ${JSON.stringify({
                brand: style.brand,
                accent: style.accent,
                neutral: style.neutral,
                solid: style.solid,
                "solid-style": style.solidStyle,
                border: style.border,
                surface: style.surface,
                transition: style.transition,
                scaling: style.scaling,
              })};
              Object.entries(config).forEach(function(e) {
                root.setAttribute('data-' + e[0], e[1]);
              });
              var saved = localStorage.getItem('data-theme');
              var resolved = (!saved || saved === 'system')
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                : saved;
              root.setAttribute('data-theme', resolved);
              Object.keys(config).forEach(function(key) {
                var v = localStorage.getItem('data-' + key);
                if (v) root.setAttribute('data-' + key, v);
              });
            } catch(e) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          })();
        `}</script>
      </head>
      <Providers>
        <Column
          as="body"
          background="page"
          fillWidth
          style={{ minHeight: "100vh" }}
          margin="0"
          padding="0"
          horizontal="center"
        >
          <RevealFx fill position="absolute" style={{ zIndex: 0, pointerEvents: "none" }}>
            <Background
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor,
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
          </RevealFx>
          {children}
        </Column>
      </Providers>
    </Flex>
  );
}
