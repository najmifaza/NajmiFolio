import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { baseURL } from "@/resources";
import { getDictionary } from "@/resources/i18n";
import { Projects } from "@/components/project/Projects";

export async function generateMetadata() {
  const { project } = await getDictionary();
  return Meta.generate({
    title: project.title,
    description: project.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(project.title)}`,
    path: project.path,
  });
}

export default async function ProjectPage() {
  const dict = await getDictionary();
  const { about, person, project } = dict;

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={project.path}
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
      <Projects />
    </Column>
  );
}
