import { prisma } from "@/lib/prisma";
import SkillsManager from "./SkillsManager";

export default async function AdminSkillsPage() {
  const skills = await prisma.skillGroup.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return <SkillsManager initialSkills={JSON.parse(JSON.stringify(skills))} />;
}
