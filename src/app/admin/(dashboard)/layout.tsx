import { verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "../admin.module.scss";
import AdminSidebar from "../components/AdminSidebar";
import { AdminToastProvider } from "../components/AdminToast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  const isValid = await verifyAuthToken(authToken);

  if (!isValid) {
    redirect("/admin/login");
  }

  const [
    projectsCount,
    experiencesCount,
    studiesCount,
    skillsCount,
    certificatesCount,
    roomsCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.study.count(),
    prisma.skillGroup.count(),
    prisma.certificate.count(),
    prisma.messageRoom.count(),
  ]);

  const counts = {
    projects: projectsCount,
    experiences: experiencesCount,
    studies: studiesCount,
    skills: skillsCount,
    certificates: certificatesCount,
    rooms: roomsCount,
  };

  return (
    <AdminToastProvider>
      <div className={styles.dashboardLayout}>
        <AdminSidebar counts={counts} />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </AdminToastProvider>
  );
}
