import { prisma } from "@/lib/prisma";
import StudiesManager from "./StudiesManager";

export default async function AdminStudiesPage() {
  const studies = await prisma.study.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return <StudiesManager initialStudies={JSON.parse(JSON.stringify(studies))} />;
}
