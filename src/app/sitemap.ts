import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";

export const dynamic = "force-static";

export default async function sitemap() {
  const blogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));
  const projectRoutes = getPosts(["src", "app", "project", "projects"]).map(
    (post) => ({
      url: `${baseURL}/project/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    }),
  );
  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs, ...projectRoutes];
}
