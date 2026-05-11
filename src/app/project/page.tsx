import { Column, Heading, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person, project } from "@/resources";
import { Projects } from "@/components/project/Projects";

export async function generateMetadata() {
  return Meta.generate({
    title: project.title,
    description: project.description,
    baseURL: baseURL,
    image: "/images/og/home.png",
    path: project.path,
  });
}

export default function ProjectPage() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={project.path}
        title={project.title}
        description={project.description}
        image="/images/og/home.png"
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
