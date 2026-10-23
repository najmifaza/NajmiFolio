import { baseURL } from "@/resources";
import { getDictionary } from "@/resources/i18n";
import type { Locale } from "@/resources/i18n";
import { Meta } from "@once-ui-system/core";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale = "id" } = (await params) || {};
  const validLocale: Locale = routeLocale === "en" ? "en" : "id";
  const dict = await getDictionary(validLocale);
  const { home } = dict;
  const normalizedBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;

  const basePath = validLocale === "en" ? "/en" : "/";
  const ogLocale = validLocale === "en" ? "en_US" : "id_ID";

  return {
    ...Meta.generate({
      title: home.title,
      description: home.description,
      baseURL: baseURL,
      path: basePath,
      image: home.image,
    }),
    applicationName: "Najmi Folio",
    metadataBase: new URL(baseURL),
    alternates: {
      canonical: `${normalizedBaseURL}${basePath}`,
      languages: {
        "id-ID": `${normalizedBaseURL}/`,
        "en-US": `${normalizedBaseURL}/en`,
        "x-default": `${normalizedBaseURL}/en`,
      },
    },
    openGraph: {
      siteName: "Najmi Folio",
      type: "website",
      locale: ogLocale,
      url: `${normalizedBaseURL}${basePath}`,
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
  };
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
