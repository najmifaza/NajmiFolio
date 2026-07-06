import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import classNames from "classnames";
import Script from "next/script";

import { Background, Column, Flex, Meta, RevealFx } from "@once-ui-system/core";
import type { opacity, SpacingToken } from "@once-ui-system/core";
import { Footer, Header, RouteGuard, Providers, LanguageProvider } from "@/components";
import {
  baseURL,
  effects,
  fonts,
  style,
  dataStyle,
} from "@/resources";
import { getDictionary } from "@/resources/i18n";
import { cookies } from "next/headers";
import type { Locale } from "@/resources/i18n";

export async function generateMetadata() {
  const dict = await getDictionary();
  const { home } = dict;
  const normalizedBaseURL = baseURL.endsWith("/")
    ? baseURL.slice(0, -1)
    : baseURL;

  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) ?? "id";
  const ogLocale = locale === "en" ? "en_US" : "id_ID";

  return {
    ...Meta.generate({
      title: home.title,
      description: home.description,
      baseURL: baseURL,
      path: home.path,
      image: home.image,
    }),
    applicationName: "Najmi Folio",
    metadataBase: new URL(baseURL),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      siteName: "Najmi Folio",
      type: "website",
      locale: ogLocale,
      url: normalizedBaseURL,
      title: home.title,
      description: home.description,
      images: [
        {
          url: home.image,
          alt: home.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: home.title,
      description: home.description,
      images: [home.image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    keywords: [
      "Adridinan Najmi Faza",
      "Najmi Faza",
      "Informatika Unsoed",
      "Web Developer Purwokerto",
      "Portofolio Web Developer Indonesia",
    ],
    authors: [{ name: "Adridinan Najmi Faza" }],
    creator: "Adridinan Najmi Faza",
    publisher: "Adridinan Najmi Faza",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) ?? "id";
  const dict = await getDictionary();
  const { person, social } = dict;

  const normalizedBaseURL = baseURL.endsWith("/")
    ? baseURL.slice(0, -1)
    : baseURL;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    alternateName: [person.lastName],
    url: normalizedBaseURL,
    image: `${normalizedBaseURL}${person.avatar}`,
    jobTitle: person.role,
    sameAs: social
      .map((socialItem) => socialItem.link)
      .filter((link) => link.startsWith("http")),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Najmi Folio",
    alternateName: ["Adridinan Najmi Faza Portfolio", "Najmi Faza"],
    url: normalizedBaseURL,
    inLanguage: locale === "en" ? "en-US" : "id-ID",
  };

  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang={locale}
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KHXXN300H0"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KHXXN300H0');
          `}
        </Script>
        <script type="application/ld+json">
          {JSON.stringify(personJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteJsonLd)}
        </script>
        <script id="theme-init">{`
              (function() {
                try {
                  const root = document.documentElement;
                  const defaultTheme = 'system';
                  
                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    "solid-style": style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    "viz-style": dataStyle.variant,
                  })};
                  
                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  
                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  // Apply saved theme
                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `}</script>
      </head>
      <Providers>
        <LanguageProvider initialLanguage={locale} initialDictionary={dict}>
          <Column
            as="body"
            background="page"
            fillWidth
            style={{ minHeight: "100vh" }}
            margin="0"
            padding="0"
            horizontal="center"
          >
            <RevealFx fill position="absolute">
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
            <Flex fillWidth minHeight="16" s={{ hide: true }} />
            <Header />
            <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
              <Flex horizontal="center" fillWidth minHeight="0">
                <RouteGuard>{children}</RouteGuard>
              </Flex>
            </Flex>
            <Footer />
          </Column>
        </LanguageProvider>
      </Providers>
    </Flex>
  );
}
