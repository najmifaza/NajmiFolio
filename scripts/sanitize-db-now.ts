import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local", override: true });
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.findFirst({
    where: { slug: "kilas-tugas" },
    include: { translations: true },
  });

  if (!project) return;

  for (const t of project.translations) {
    let clean = t.content;
    // Replace <20ms and <2s outside code blocks with safe &lt;
    clean = clean.replace(/<20ms/g, "&lt;20ms").replace(/<2s/g, "&lt;2s");
    clean = clean.replace(/<(?=[0-9=\s:_-])/g, "&lt;");

    await prisma.projectTranslation.update({
      where: { id: t.id },
      data: { content: clean },
    });
    console.log(`Cleaned translation [${t.locale}] in Supabase.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
