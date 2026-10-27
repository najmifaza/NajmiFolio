import { prisma } from "@/lib/prisma";
import ProjectsManager from "./ProjectsManager";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    include: { translations: true },
  });

  return <ProjectsManager initialProjects={JSON.parse(JSON.stringify(projects))} />;
}
