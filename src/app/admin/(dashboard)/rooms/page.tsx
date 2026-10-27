import { prisma } from "@/lib/prisma";
import RoomsManager from "./RoomsManager";

export default async function AdminRoomsPage() {
  const rooms = await prisma.messageRoom.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  return <RoomsManager initialRooms={JSON.parse(JSON.stringify(rooms))} />;
}
