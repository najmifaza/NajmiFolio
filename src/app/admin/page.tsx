import { verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const isValid = await verifyAuthToken(authToken);

  if (!isValid) {
    redirect("/admin/login");
  }

  const [projects, profile, experiences, certificates, studies, skills] = await Promise.all([
    prisma.project.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      include: { translations: true },
    }),
    prisma.profile.findUnique({
      where: { id: "default" },
      include: {
        translations: true,
        socialLinks: { orderBy: { order: "asc" } },
      },
    }),
    prisma.experience.findMany({
      orderBy: { order: "asc" },
      include: { translations: true },
    }),
    prisma.certificate.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.study.findMany({
      orderBy: { order: "asc" },
      include: { translations: true },
    }),
    prisma.skillGroup.findMany({
      orderBy: { order: "asc" },
      include: { translations: true },
    }),
  ]);

  return (
    <AdminDashboard
      initialProjects={JSON.parse(JSON.stringify(projects))}
      initialProfile={JSON.parse(JSON.stringify(profile))}
      initialExperiences={JSON.parse(JSON.stringify(experiences))}
      initialCertificates={JSON.parse(JSON.stringify(certificates))}
      initialStudies={JSON.parse(JSON.stringify(studies))}
      initialSkills={JSON.parse(JSON.stringify(skills))}
    />
  );
}
