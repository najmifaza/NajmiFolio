import { ProjectCard } from "@/components";
import type { Locale } from "@/resources/i18n";
import { getPostsForCurrentLocale } from "@/utils/utils";
import { Column } from "@once-ui-system/core";
import { cookies } from "next/headers";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  locale?: Locale;
}

export async function Projects({ range, exclude, locale: propLocale }: ProjectsProps) {
  let locale: Locale = propLocale || "id";
  if (!propLocale) {
    try {
      const cookieStore = await cookies();
      locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) ?? "id";
    } catch {
      locale = "id";
    }
  }

  let allProjects = await getPostsForCurrentLocale(["src", "app", "project", "projects"], locale);

  // Exclude by slug (exact match)
  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((post) => !exclude.includes(post.slug));
  }

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  const projectHrefPrefix = locale === "en" ? "/en/project" : "/project";

  return (
    <Column fillWidth gap="l" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          key={post.slug}
          priority={index < 2}
          href={`${projectHrefPrefix}/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
    </Column>
  );
}
