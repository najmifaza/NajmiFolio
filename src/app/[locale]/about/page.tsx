import { baseURL } from "@/resources";
import { getDictionary } from "@/resources/i18n";
import type { Locale } from "@/resources/i18n";
import { Meta } from "@once-ui-system/core";
import AboutClient from "./AboutClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale = "id" } = (await params) || {};
  const locale: Locale = routeLocale === "en" ? "en" : "id";
  const { about } = await getDictionary(locale);
  const basePath = locale === "en" ? "/en/about" : "/about";

  return {
    ...Meta.generate({
      title: about.title,
      description: about.description,
      baseURL: baseURL,
      image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
      path: basePath,
    }),
    alternates: {
      canonical: `${baseURL}${basePath}`,
      languages: {
        "id-ID": `${baseURL}/about`,
        "en-US": `${baseURL}/en/about`,
        "x-default": `${baseURL}/en/about`,
      },
    },
  };
}

export default function About() {
  return <AboutClient />;
}
