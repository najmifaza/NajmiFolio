import { prisma } from "@/lib/prisma";
import ProfileManager from "./ProfileManager";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findUnique({
    where: { id: "default" },
    include: {
      translations: true,
      socialLinks: { orderBy: { order: "asc" } },
    },
  });

  return <ProfileManager profile={JSON.parse(JSON.stringify(profile))} />;
}
