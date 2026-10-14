import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getDictionary } from "@/resources/i18n";
import type { Locale } from "@/resources/i18n";
import { Projects } from "@/components/project/Projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale = "id" } = (await params) || {};
  const locale: Locale = routeLocale === "en" ? "en" : "id";
  const { project } = await getDictionary(locale);
  const basePath = locale === "en" ? "/en/project" : "/project";

  return {
    ...Meta.generate({
      title: project.title,
      description: project.description,
      baseURL: baseURL,
      image: `/api/og/generate?title=${encodeURIComponent(project.title)}`,
      path: basePath,
    }),
    alternates: {
      canonical: `${baseURL}${basePath}`,
      languages: {
        "id-ID": `${baseURL}/project`,
        "en-US": `${baseURL}/en/project`,
        "x-default": `${baseURL}/en/project`,
      },
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: routeLocale = "id" } = (await params) || {};
  const locale: Locale = routeLocale === "en" ? "en" : "id";
  const dict = await getDictionary(locale);
  const { about, person, project } = dict;

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={locale === "en" ? "/en/project" : project.path}
        title={project.title}
        description={project.description}
        image={`/api/og/generate?title=${encodeURIComponent(project.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-l" align="center">
        {project.title}
      </Heading>
      <Projects locale={locale} />
    </Column>
  );
}
