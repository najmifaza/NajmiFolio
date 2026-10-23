import styles from "@/components/about/about.module.scss";
import LicensesView from "@/components/licenses/LicensesView";
import { baseURL } from "@/resources";
import { getDictionary } from "@/resources/i18n";
import type { Locale } from "@/resources/i18n";
import { Flex, Heading, Meta, Schema } from "@once-ui-system/core";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale = "id" } = (await params) || {};
  const locale: Locale = routeLocale === "en" ? "en" : "id";
  const { licenses } = await getDictionary(locale);
  const basePath = locale === "en" ? "/en/licenses" : "/licenses";

  return {
    ...Meta.generate({
      title: licenses.title,
      description: licenses.description,
      baseURL: baseURL,
      image: `/api/og/generate?title=${encodeURIComponent(licenses.title)}&locale=${locale}`,
      path: basePath,
    }),
    alternates: {
      canonical: `${baseURL}${basePath}`,
      languages: {
        "id-ID": `${baseURL}/licenses`,
        "en-US": `${baseURL}/en/licenses`,
        "x-default": `${baseURL}/en/licenses`,
      },
    },
  };
}

export default async function Licenses({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale = "id" } = (await params) || {};
  const locale: Locale = routeLocale === "en" ? "en" : "id";
  const dict = await getDictionary(locale);
  const { licenses, person } = dict;

  return (
    <Flex maxWidth="l" direction="column" gap="32">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={licenses.title}
        description={licenses.description}
        path={locale === "en" ? "/en/licenses" : licenses.path}
        image={`/api/og/generate?title=${encodeURIComponent(licenses.title)}&locale=${locale}`}
        author={{
          name: person.name,
          url: `${baseURL}${locale === "en" ? "/en/licenses" : licenses.path}`,
          image: person.avatar?.startsWith("http") ? person.avatar : `${baseURL}${person.avatar}`,
        }}
      />
      <Heading
        style={{ fontSize: "22px", marginTop: "20px" }}
        padding="4"
        className={styles.textAlign}
        align="center"
      >
        {licenses.label}
      </Heading>
      <LicensesView />
    </Flex>
  );
}
