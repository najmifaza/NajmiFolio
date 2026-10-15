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

  // Query sequentially in just 2 queries to prevent pool timeout (P2024)
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    include: { translations: true },
  });

  const profile = await prisma.profile.findUnique({
    where: { id: "default" },
    include: {
      translations: true,
      socialLinks: { orderBy: { order: "asc" } },
      experiences: {
        include: { translations: true },
        orderBy: { order: "asc" },
      },
      certificates: {
        orderBy: { order: "asc" },
      },
      studies: {
        include: { translations: true },
        orderBy: { order: "asc" },
      },
      skills: {
        include: { translations: true },
        orderBy: { order: "asc" },
      },
    },
  });

  const experiences = profile?.experiences || [];
  const certificates = profile?.certificates || [];
  const studies = profile?.studies || [];
  const skills = profile?.skills || [];

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
