import { CustomMDX, ScrollToHash } from "@/components";
import { Projects } from "@/components/project/Projects";
import { baseURL } from "@/resources";
import { getDictionary } from "@/resources/i18n";
import type { Locale } from "@/resources/i18n";
import { getProjectBySlugFromDB } from "@/services/projectService";
import { formatDate } from "@/utils/formatDate";
import { getPostsForCurrentLocale } from "@/utils/utils";
import {
  AvatarGroup,
  Column,
  Heading,
  Line,
  Media,
  Meta,
  Row,
  Schema,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const locale: Locale = routeParams.locale === "en" ? "en" : "id";
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  let post = await getProjectBySlugFromDB(slugPath, locale);
  if (!post) {
    const posts = await getPostsForCurrentLocale(["src", "app", "project", "projects"], locale);
    post = posts.find((p) => p.slug === slugPath) || null;
  }

  if (!post) return {};

  const basePath = `/project/${post.slug}`;
  const canonicalPath = locale === "en" ? `/en${basePath}` : basePath;

  return {
    ...Meta.generate({
      title: post.metadata.title,
      description: post.metadata.summary,
      baseURL: baseURL,
      image:
        post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
      path: canonicalPath,
    }),
    alternates: {
      canonical: `${baseURL}${canonicalPath}`,
      languages: {
        "id-ID": `${baseURL}${basePath}`,
        "en-US": `${baseURL}/en${basePath}`,
        "x-default": `${baseURL}/en${basePath}`,
      },
    },
  };
}

export default async function Project({
  params,
}: {
  params: Promise<{ locale: string; slug: string | string[] }>;
}) {
  const routeParams = await params;
  const locale: Locale = routeParams.locale === "en" ? "en" : "id";
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const dict = await getDictionary(locale);
  const { about, person, project } = dict;

  let post = await getProjectBySlugFromDB(slugPath, locale);
  if (!post) {
    const posts = await getPostsForCurrentLocale(["src", "app", "project", "projects"], locale);
    post = posts.find((p) => p.slug === slugPath) || null;
  }

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  const projectListHref = locale === "en" ? "/en/project" : "/project";

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={locale === "en" ? `/en/project/${post.slug}` : `${project.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.publishedAt}
        image={
          post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
        }
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: person.avatar?.startsWith("http") ? person.avatar : `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href={projectListHref}>
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
        </Text>
        <Heading variant="display-strong-m">{post.metadata.title}</Heading>
      </Column>
      <Row marginBottom="32" horizontal="center">
        <Row gap="16" vertical="center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="s" />}
          <Text variant="label-default-m" onBackground="brand-weak">
            {post.metadata.team?.map((member, idx) => (
              <span key={idx}>
                {idx > 0 && (
                  <Text as="span" onBackground="neutral-weak">
                    ,{" "}
                  </Text>
                )}
                <SmartLink href={member.linkedIn}>{member.name}</SmartLink>
              </span>
            ))}
          </Text>
        </Row>
      </Row>
      {post.metadata.images.length > 0 && (
        <Media priority aspectRatio="16 / 9" radius="m" alt="image" src={post.metadata.images[0]} />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <CustomMDX source={post.content} />
      </Column>
      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-l" marginBottom="24">
          Related projects
        </Heading>
        <Projects exclude={[post.slug]} range={[2]} locale={locale} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
