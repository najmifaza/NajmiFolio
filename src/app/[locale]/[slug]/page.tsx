import { prisma } from "@/lib/prisma";
import { Column } from "@once-ui-system/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnonymousMessageForm from "./AnonymousMessageForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = await prisma.messageRoom.findUnique({
    where: { slug },
  });

  if (!room) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  return {
    title: `${room.title} | Pesan Anonim`,
    description: room.description || `Kirim pesan anonim untuk ${room.title}`,
    robots: { index: false, follow: false },
  };
}

export default async function AnonymousMessagePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  const room = await prisma.messageRoom.findUnique({
    where: { slug },
  });

  if (!room) {
    notFound();
  }

  const now = new Date();
  const notYetOpen = room.openAt ? now < new Date(room.openAt) : false;
  const isClosed = room.closeAt ? now > new Date(room.closeAt) : false;
  const isInactive = !room.isActive;
  const isOpen = !isInactive && !notYetOpen && !isClosed;

  let statusMessage = "Menerima Pesan Anonim";
  let indicatorColor: "green" | "yellow" | "red" | "gray" = "green";

  if (isInactive) {
    statusMessage = "Ruang pesan sedang dinonaktifkan oleh pemilik";
    indicatorColor = "gray";
  } else if (notYetOpen && room.openAt) {
    statusMessage = `Dibuka pada: ${new Date(room.openAt).toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    })}`;
    indicatorColor = "yellow";
  } else if (isClosed && room.closeAt) {
    statusMessage = `Sudah ditutup sejak: ${new Date(room.closeAt).toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    })}`;
    indicatorColor = "red";
  }

  return (
    <Column fillWidth horizontal="center" align="center" paddingY="32">
      <AnonymousMessageForm
        slug={room.slug}
        roomTitle={room.title}
        roomDescription={room.description}
        isOpen={isOpen}
        statusMessage={statusMessage}
        indicatorColor={indicatorColor}
      />
    </Column>
  );
}
