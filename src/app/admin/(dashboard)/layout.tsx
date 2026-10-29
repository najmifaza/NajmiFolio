import { verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Column, Flex, Row } from "@once-ui-system/core";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
      <Row fill style={{ minHeight: "100vh" }}>
        <AdminSidebar counts={counts} />
        {/* Mirror publik: Flex padding="l" horizontal="center" wrapping content */}
        <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1} style={{ overflowY: "auto" }}>
          <Flex horizontal="center" fillWidth minHeight="0">
            <Column as="main" fillWidth style={{ maxWidth: 1200 }}>
              {children}
            </Column>
          </Flex>
        </Flex>
      </Row>
    </AdminToastProvider>
  );
}
