"use client";

import type React from "react";
import { useState } from "react";
import { type SaveMessageRoomInput, saveMessageRoomAction } from "../actions";
import styles from "../admin.module.scss";

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
    <div className={styles.glassCard} style={{ marginBottom: "24px" }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#fff" }}>
            {room?.id ? "Edit Ruang Pesan Anonim" : "Buat Ruang Pesan Anonim Baru"}
          </h3>
          <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.45)" }}>
            Praktikan / Mahasiswa
          </span>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Judul Ruang / Acara / Praktikum *</label>
            <input
              className={styles.formInput}
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
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>Slug URL (contoh: /BasdatShiftC) *</label>
              <button
                type="button"
                onClick={handleGenerateSlug}
                style={{
                  background: "none",
                  border: "none",
                  color: "#38bdf8",
                  fontSize: "11px",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Generate Otomatis
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.4)" }}>/</span>
              <input
                className={styles.formInput}
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                placeholder="BasdatShiftC"
              />
            </div>
            {slug && (
              <span style={{ fontSize: "11px", color: "#10b981" }}>
                Preview link:{" "}
                {typeof window !== "undefined" ? window.location.host : "localhost:3000"}/
                {slug.replace(/^\/+/, "")}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Deskripsi / Instruksi untuk Praktikan (Opsional)</label>
          <textarea
            className={styles.formTextarea}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan petunjuk untuk praktikan, misal: 'Silakan berikan kritik, saran, atau kendala modul 4 secara bebas dan rahasia.'"
          />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Jadwal Buka (Opsional)</label>
            <input
              type="datetime-local"
              className={styles.formInput}
              value={openAt}
              onChange={(e) => setOpenAt(e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
              Kosongkan jika ingin langsung dibuka sekarang.
            </span>
          </div>

          <div className={styles.formGroup}>
            <label>Jadwal Tutup (Opsional)</label>
            <input
              type="datetime-local"
              className={styles.formInput}
              value={closeAt}
              onChange={(e) => setCloseAt(e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
              Kosongkan jika tidak ada batas waktu penutupan.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="roomActiveToggle"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label
            htmlFor="roomActiveToggle"
            style={{ fontSize: "13px", cursor: "pointer", color: "#f1f5f9" }}
          >
            Status Aktif (Bisa menerima pesan jika jadwal sesuai)
          </label>
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}
        >
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onCancel}
            disabled={saving}
          >
            Batal
          </button>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? "Menyimpan..." : room?.id ? "Perbarui Ruang" : "Buat Ruang"}
          </button>
        </div>
      </form>
    </div>
  );
}
