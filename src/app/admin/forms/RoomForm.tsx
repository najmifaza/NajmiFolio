"use client";

import { Button, Column, Heading, Input, Row, Switch, Text, Textarea } from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";
import { type SaveMessageRoomInput, saveMessageRoomAction } from "../actions";

function toInputDateTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function generateRandomSlug(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const rand = Math.random().toString(36).substring(2, 6);
  return base ? `${base}-${rand}` : `room-${rand}`;
}

export default function RoomForm({
  room,
  onCancel,
  onSave,
}: {
  room?: any;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(room?.title || "");
  const [slug, setSlug] = useState(room?.slug || "");
  const [description, setDescription] = useState(room?.description || "");
  const [openAt, setOpenAt] = useState(toInputDateTime(room?.openAt));
  const [closeAt, setCloseAt] = useState(toInputDateTime(room?.closeAt));
  const [isActive, setIsActive] = useState<boolean>(room?.isActive ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSlug = () => {
    const generated = generateRandomSlug(title);
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: SaveMessageRoomInput = {
        id: room?.id,
        title: title.trim(),
        slug: slug.trim().replace(/^\/+/, ""),
        description: description.trim() || undefined,
        openAt: openAt ? new Date(openAt).toISOString() : null,
        closeAt: closeAt ? new Date(closeAt).toISOString() : null,
        isActive,
      };

      await saveMessageRoomAction(payload);
      onSave();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan ruang pesan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Column
      background="surface"
      border="neutral-alpha-weak"
      radius="l"
      padding="24"
      gap="24"
      fillWidth
      style={{ marginBottom: 24 }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}
      >
        <Row vertical="center" horizontal="between">
          <Heading as="h2" variant="heading-strong-s" onBackground="neutral-strong">
            {room?.id ? "Edit Ruang Pesan Anonim" : "Buat Ruang Pesan Anonim Baru"}
          </Heading>
          <Text variant="label-default-xs" onBackground="neutral-weak">
            Praktikan / Mahasiswa
          </Text>
        </Row>

        {error && (
          <Row padding="12" radius="m" background="danger-alpha-weak" border="danger-alpha-medium">
            <Text variant="label-default-s" onBackground="danger-medium">
              {error}
            </Text>
          </Row>
        )}

        <Row gap="16" wrap fillWidth>
          <Column gap="8" style={{ flex: 1.5, minWidth: 260 }}>
            <Input
              id="room-title"
              label="Judul Ruang / Acara / Praktikum *"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slug && !room?.id) {
                  setSlug(e.target.value.trim().replace(/[^a-zA-Z0-9_-]/g, ""));
                }
              }}
              placeholder="Contoh: Praktikum Basis Data Shift C"
            />
          </Column>

          <Column gap="8" style={{ flex: 1, minWidth: 220 }}>
            <Row vertical="center" horizontal="between">
              <Text variant="label-default-xs" onBackground="neutral-medium">
                Slug URL (contoh: /BasdatShiftC) *
              </Text>
              <Button
                type="button"
                variant="secondary"
                size="s"
                label="⚡ Generate"
                onClick={handleGenerateSlug}
              />
            </Row>
            <Input
              id="room-slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
              placeholder="BasdatShiftC"
              hasPrefix="/"
            />
            {slug && (
              <Text variant="label-default-xs" style={{ color: "var(--brand-solid-strong)" }}>
                Preview link: /{slug.replace(/^\/+/, "")}
              </Text>
            )}
          </Column>
        </Row>

        <Column gap="8" fillWidth>
          <Textarea
            id="room-desc"
            label="Deskripsi / Instruksi untuk Praktikan (Opsional)"
            lines={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan petunjuk untuk praktikan, misal: 'Silakan berikan kritik, saran, atau kendala modul 4 secara bebas dan rahasia.'"
          />
        </Column>

        <Row gap="16" wrap fillWidth>
          <Column gap="8" style={{ flex: 1, minWidth: 220 }}>
            <Input
              id="room-open-at"
              label="Jadwal Buka (Opsional)"
              type="datetime-local"
              value={openAt}
              onChange={(e) => setOpenAt(e.target.value)}
              description="Kosongkan jika langsung dibuka."
            />
          </Column>

          <Column gap="8" style={{ flex: 1, minWidth: 220 }}>
            <Input
              id="room-close-at"
              label="Jadwal Tutup (Opsional)"
              type="datetime-local"
              value={closeAt}
              onChange={(e) => setCloseAt(e.target.value)}
              description="Kosongkan jika tanpa batas waktu."
            />
          </Column>
        </Row>

        <Row vertical="center" gap="12">
          <Switch
            isChecked={isActive}
            onToggle={() => setIsActive(!isActive)}
            label="Status Aktif (Form dibuka untuk pengiriman pesan anonim jika jadwal sesuai)"
          />
        </Row>

        <Row horizontal="end" gap="12" paddingTop="16" borderTop="neutral-alpha-weak">
          <Button
            type="button"
            variant="secondary"
            size="m"
            label="Batal"
            onClick={onCancel}
            disabled={saving}
          />
          <Button
            type="submit"
            variant="primary"
            size="m"
            label={saving ? "Menyimpan..." : room?.id ? "Perbarui Ruang" : "Buat Ruang"}
            disabled={saving}
            loading={saving}
          />
        </Row>
      </form>
    </Column>
  );
}
