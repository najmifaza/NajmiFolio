import { prisma } from "@/lib/prisma";
import ExperiencesManager from "./ExperiencesManager";

export default async function AdminExperiencesPage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return <ExperiencesManager initialExperiences={JSON.parse(JSON.stringify(experiences))} />;
}
