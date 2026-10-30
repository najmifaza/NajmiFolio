"use client";

import { deleteMessageRoomAction } from "@/app/admin/actions";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import RoomForm from "@/app/admin/forms/RoomForm";
import {
  Button,
  Column,
  Heading,
  Row,
  SmartLink,
  StatusIndicator,
  Text,
} from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomsManager({ initialRooms }: { initialRooms: any[] }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [rooms, setRooms] = useState<any[]>(initialRooms);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  return (
    <Column gap="24" fillWidth>
      <Row
        vertical="center"
        horizontal="between"
        paddingBottom="20"
        borderBottom="neutral-alpha-weak"
        wrap
        gap="16"
      >
        <Column gap="4">
          <Heading as="h1" variant="heading-strong-m" onBackground="neutral-strong">
            Ruang Pesan Anonim
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Kelola slug ruang untuk praktikan kirim pesan anonim, jadwal buka-tutup, dan status
            aktif.
          </Text>
        </Column>
        {!isCreatingRoom && !editingRoom && (
          <Button
            type="button"
            variant="primary"
            size="m"
            label="+ Buat Ruang Pesan Baru"
            onClick={() => {
              setIsCreatingRoom(true);
              setEditingRoom(null);
            }}
          />
        )}
      </Row>

      {(isCreatingRoom || editingRoom) && (
        <RoomForm
          room={editingRoom}
          onCancel={() => {
            setIsCreatingRoom(false);
            setEditingRoom(null);
          }}
          onSave={() => {
            setIsCreatingRoom(false);
            setEditingRoom(null);
            showToast("success", "Ruang pesan berhasil disimpan!");
            router.refresh();
          }}
        />
      )}

      {rooms.length === 0 && !isCreatingRoom && (
        <Row center padding="48" radius="l" background="surface" border="neutral-alpha-weak">
          <Text variant="body-default-s" onBackground="neutral-weak">
            Belum ada ruang pesan anonim. Klik &quot;+ Buat Ruang Pesan Baru&quot; untuk membuat.
          </Text>
        </Row>
      )}

      <Column gap="12" fillWidth>
        {rooms.map((room) => {
          const now = new Date();
          const notYetOpen = room.openAt && now < new Date(room.openAt);
          const isClosed = room.closeAt && now > new Date(room.closeAt);
          let scheduleText = "Menerima Pesan";
          let indicatorColor: "green" | "yellow" | "red" | "gray" = "green";

          if (!room.isActive) {
            scheduleText = "Nonaktif";
            indicatorColor = "gray";
          } else if (notYetOpen) {
            scheduleText = `Buka: ${new Date(room.openAt).toLocaleString("id-ID", {
              dateStyle: "short",
              timeStyle: "short",
            })}`;
            indicatorColor = "yellow";
          } else if (isClosed) {
            scheduleText = `Tutup: ${new Date(room.closeAt).toLocaleString("id-ID", {
              dateStyle: "short",
              timeStyle: "short",
            })}`;
            indicatorColor = "red";
          }

          return (
            <Row
              key={room.id}
              vertical="center"
              horizontal="between"
              padding="16"
              radius="m"
              background="surface"
              border="neutral-alpha-weak"
              gap="16"
              className="admin-card-row"
            >
              <Column gap="8" style={{ flex: 1, minWidth: 200 }}>
                <Row vertical="center" gap="12" wrap>
                  <Text variant="heading-strong-xs" onBackground="neutral-strong">
                    {room.title}
                  </Text>
                  <Row
                    vertical="center"
                    gap="8"
                    paddingX="8"
                    paddingY="2"
                    radius="full"
                    background="neutral-alpha-weak"
                    border="neutral-alpha-weak"
                  >
                    <StatusIndicator color={indicatorColor} size="s" />
                    <Text variant="label-default-xs" onBackground="neutral-strong">
                      {scheduleText}
                    </Text>
                  </Row>
                </Row>

                <Row vertical="center" gap="12" wrap>
                  <Text
                    variant="label-default-s"
                    style={{ color: "var(--brand-solid-strong)", fontFamily: "monospace" }}
                  >
                    /{room.slug}
                  </Text>
                  <Button
                    type="button"
                    variant="secondary"
                    size="s"
                    label={copiedSlug === room.slug ? "✓ Tersalin!" : "Salin Link"}
                    onClick={() => {
                      const fullUrl = `${window.location.origin}/${room.slug}`;
                      navigator.clipboard.writeText(fullUrl);
                      setCopiedSlug(room.slug);
                      setTimeout(() => setCopiedSlug(null), 2000);
                    }}
                  />
                  <SmartLink href={`/${room.slug}`} target="_blank" rel="noopener noreferrer">
                    <Text variant="label-default-xs" onBackground="neutral-weak">
                      Buka ↗
                    </Text>
                  </SmartLink>
                </Row>

                {room.description && (
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {room.description}
                  </Text>
                )}
              </Column>

              <Row vertical="center" gap="8" className="admin-card-actions" style={{ flexShrink: 0 }}>
                <SmartLink href={`/admin/rooms/${room.id}`} style={{ textDecoration: "none" }}>
                  <Button
                    type="button"
                    variant="primary"
                    size="s"
                    label={`Inbox (${room.messages?.length ?? room._count?.messages ?? 0})`}
                  />
                </SmartLink>
                <Button
                  type="button"
                  variant="secondary"
                  size="s"
                  label="Edit"
                  onClick={() => {
                    setIsCreatingRoom(false);
                    setEditingRoom(room);
                  }}
                />
                <Button
                  type="button"
                  variant="danger"
                  size="s"
                  label="Hapus"
                  onClick={async () => {
                    if (confirm(`Hapus ruang "${room.title}" beserta seluruh pesannya?`)) {
                      await deleteMessageRoomAction(room.id);
                      setRooms(rooms.filter((r) => r.id !== room.id));
                      showToast("success", "Ruang pesan dihapus");
                      router.refresh();
                    }
                  }}
                />
              </Row>
            </Row>
          );
        })}
      </Column>
    </Column>
  );
}
