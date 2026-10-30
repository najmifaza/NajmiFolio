"use client";

import { deleteAnonymousMessageAction } from "@/app/admin/actions";
import { useAdminToast } from "@/app/admin/components/AdminToast";
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
import { useState } from "react";

export default function RoomInboxView({ room }: { room: any }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [messages, setMessages] = useState<any[]>(room.messages || []);

  return (
    <Column gap="20" fillWidth>
      <Row vertical="center" horizontal="between" wrap gap="12">
        <SmartLink href="/admin/rooms" style={{ textDecoration: "none" }}>
          <Button type="button" variant="secondary" size="s" label="← Kembali ke Daftar Ruang" />
        </SmartLink>

        <SmartLink href={`/${room.slug}`} target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="tertiary" size="s" label="Buka Form Publik ↗" />
        </SmartLink>
      </Row>

      <Column
        background="surface"
        border="neutral-alpha-weak"
        radius="l"
        padding="24"
        gap="12"
        fillWidth
      >
        <Row vertical="center" horizontal="between" wrap gap="12">
          <Column gap="8">
            <Heading as="h2" variant="heading-strong-s" onBackground="neutral-strong">
              {room.title}
            </Heading>
            <Row vertical="center" gap="8">
              <Text
                variant="label-default-xs"
                style={{ fontFamily: "monospace", color: "var(--brand-solid-strong)" }}
              >
                /{room.slug}
              </Text>
              <Text variant="label-default-xs" onBackground="neutral-weak">
                •
              </Text>
              <Row vertical="center" gap="4">
                <StatusIndicator color={room.isActive ? "emerald" : "gray"} size="s" />
                <Text variant="label-default-xs" onBackground="neutral-strong">
                  {room.isActive ? "Aktif" : "Nonaktif"}
                </Text>
              </Row>
            </Row>
            {room.description && (
              <Text variant="body-default-xs" onBackground="neutral-weak" style={{ marginTop: 4 }}>
                {room.description}
              </Text>
            )}
          </Column>

          <Row
            vertical="center"
            paddingX="16"
            paddingY="8"
            radius="full"
            background="brand-alpha-weak"
            border="brand-alpha-weak"
          >
            <Text variant="label-strong-xs" style={{ color: "var(--brand-on-background-medium)" }}>
              {messages.length} Pesan Masuk
            </Text>
          </Row>
        </Row>
      </Column>

      <Column gap="12" fillWidth>
        {messages.length === 0 ? (
          <Row center padding="48" radius="l" background="surface" border="neutral-alpha-weak">
            <Text variant="body-default-s" onBackground="neutral-weak">
              Belum ada pesan anonim yang masuk untuk ruang ini.
            </Text>
          </Row>
        ) : (
          messages.map((msg: any) => (
            <Column
              key={msg.id}
              background="surface"
              border="neutral-alpha-weak"
              radius="m"
              padding="16"
              gap="12"
              fillWidth
            >
              <Row vertical="center" horizontal="between" wrap gap="12">
                <Row vertical="center" gap="12">
                  <Row
                    vertical="center"
                    paddingX="8"
                    paddingY="4"
                    radius="full"
                    background={msg.senderTag ? "brand-alpha-weak" : "neutral-alpha-weak"}
                    border={msg.senderTag ? "brand-alpha-weak" : "neutral-alpha-weak"}
                  >
                    <Text
                      variant="label-strong-xs"
                      onBackground={msg.senderTag ? "brand-medium" : "neutral-weak"}
                    >
                      {msg.senderTag ? msg.senderTag : "Anonim"}
                    </Text>
                  </Row>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {new Date(msg.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Text>
                </Row>
                <Button
                  type="button"
                  variant="danger"
                  size="s"
                  label="Hapus"
                  onClick={async () => {
                    if (confirm("Hapus pesan anonim ini?")) {
                      await deleteAnonymousMessageAction(msg.id);
                      setMessages((prev) => prev.filter((m: any) => m.id !== msg.id));
                      showToast("success", "Pesan berhasil dihapus");
                      router.refresh();
                    }
                  }}
                />
              </Row>
              <Text
                variant="body-default-m"
                onBackground="neutral-strong"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {msg.content}
              </Text>
            </Column>
          ))
        )}
      </Column>
    </Column>
  );
}
