"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SendAnonymousMessageInput {
  slug: string;
  content: string;
  senderTag?: string;
}

export async function sendAnonymousMessageAction(input: SendAnonymousMessageInput): Promise<{
  success: boolean;
  error?: string;
}> {
  const cleanSlug = input.slug.trim().replace(/^\/+/, "");
  if (!cleanSlug) {
    return { success: false, error: "Slug tidak valid" };
  }

  const room = await prisma.messageRoom.findUnique({
    where: { slug: cleanSlug },
  });

  if (!room) {
    return { success: false, error: "Ruang pesan tidak ditemukan" };
  }

  if (!room.isActive) {
    return { success: false, error: "Ruang pesan ini sedang dinonaktifkan oleh pemilik." };
  }

  const now = new Date();

  if (room.openAt && now < new Date(room.openAt)) {
    const formatted = new Date(room.openAt).toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });
    return {
      success: false,
      error: `Pesan belum dibuka. Ruang ini akan dibuka pada: ${formatted}.`,
    };
  }

  if (room.closeAt && now > new Date(room.closeAt)) {
    const formatted = new Date(room.closeAt).toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });
    return {
      success: false,
      error: `Pesan sudah ditutup pada: ${formatted}.`,
    };
  }

  const cleanContent = input.content.trim();
  if (!cleanContent) {
    return { success: false, error: "Pesan tidak boleh kosong" };
  }

  if (cleanContent.length < 2) {
    return { success: false, error: "Pesan terlalu pendek (minimal 2 karakter)" };
  }

  if (cleanContent.length > 2500) {
    return { success: false, error: "Pesan terlalu panjang (maksimal 2500 karakter)" };
  }

  const cleanTag = input.senderTag?.trim().slice(0, 50) || null;

  try {
    await prisma.anonymousMessage.create({
      data: {
        roomId: room.id,
        content: cleanContent,
        senderTag: cleanTag,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal mengirim pesan anonim" };
  }
}
