import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RoomInboxView from "./RoomInboxView";

export default async function AdminRoomInboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await prisma.messageRoom.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!room) {
    notFound();
  }

  return <RoomInboxView room={JSON.parse(JSON.stringify(room))} />;
}
