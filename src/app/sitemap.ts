import { getPostsForCurrentLocale } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";

export default async function sitemap() {
  const normalizedBaseURL = baseURL.endsWith("/")
    ? baseURL.slice(0, -1)
    : baseURL;

  const posts = await getPostsForCurrentLocale(["src", "app", "project", "projects"]);
  const projectRoutes = posts.map(
    (post) => ({
      url: `${normalizedBaseURL}/project/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    }),
  );
  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routes = activeRoutes.map((route) => ({
    url: `${normalizedBaseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...projectRoutes];
}
