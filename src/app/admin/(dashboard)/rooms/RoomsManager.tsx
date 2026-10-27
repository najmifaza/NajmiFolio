"use client";

import { deleteMessageRoomAction } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.scss";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import RoomForm from "@/app/admin/forms/RoomForm";
import Link from "next/link";
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
    <div>
      <div className={styles.contentHeader}>
        <div className={styles.pageTitleGroup}>
          <h1>Ruang Pesan Anonim</h1>
          <p>
            Kelola slug ruang untuk praktikan kirim pesan anonim, jadwal buka-tutup, dan status
            aktif.
          </p>
        </div>
        {!isCreatingRoom && !editingRoom && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setIsCreatingRoom(true);
              setEditingRoom(null);
            }}
          >
            + Buat Ruang Pesan Baru
          </button>
        )}
      </div>

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
        <div
          className={styles.glassCard}
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: "rgba(255, 255, 255, 0.45)",
            fontSize: "13.5px",
          }}
        >
          Belum ada ruang pesan anonim. Klik &quot;+ Buat Ruang Pesan Baru&quot; untuk membuat.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {rooms.map((room) => {
          const now = new Date();
          const notYetOpen = room.openAt && now < new Date(room.openAt);
          const isClosed = room.closeAt && now > new Date(room.closeAt);
          let scheduleText = "Menerima Pesan";

          if (!room.isActive) {
            scheduleText = "Nonaktif";
          } else if (notYetOpen) {
            scheduleText = `Buka: ${new Date(room.openAt).toLocaleString("id-ID", {
              dateStyle: "short",
              timeStyle: "short",
            })}`;
          } else if (isClosed) {
            scheduleText = `Tutup: ${new Date(room.closeAt).toLocaleString("id-ID", {
              dateStyle: "short",
              timeStyle: "short",
            })}`;
          }

          const statusClass = !room.isActive
            ? styles.inactive
            : notYetOpen
              ? styles.scheduled
              : isClosed
                ? styles.closed
                : styles.active;

          return (
            <div key={room.id} className={styles.itemCard}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "15px", color: "#fff" }}>
                    {room.title}
                  </span>
                  <span className={`${styles.statusPill} ${statusClass}`}>{scheduleText}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "#38bdf8", fontFamily: "monospace" }}>/{room.slug}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const fullUrl = `${window.location.origin}/${room.slug}`;
                      navigator.clipboard.writeText(fullUrl);
                      setCopiedSlug(room.slug);
                      setTimeout(() => setCopiedSlug(null), 2000);
                    }}
                    className={styles.aiButton}
                    style={{ padding: "2px 8px", fontSize: "11px" }}
                  >
                    {copiedSlug === room.slug ? "✓ Tersalin!" : "Salin Link"}
                  </button>
                  <a
                    href={`/${room.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryButton}
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      textDecoration: "none",
                    }}
                  >
                    Buka ↗
                  </a>
                </div>

                {room.description && (
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "rgba(255, 255, 255, 0.45)",
                      lineHeight: "1.4",
                    }}
                  >
                    {room.description}
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                <Link
                  href={`/admin/rooms/${room.id}`}
                  className={styles.primaryButton}
                  style={{ padding: "6px 14px", fontSize: "12.5px", textDecoration: "none" }}
                >
                  Inbox ({room.messages?.length ?? room._count?.messages ?? 0})
                </Link>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  style={{ padding: "6px 14px", fontSize: "12.5px" }}
                  onClick={() => {
                    setIsCreatingRoom(false);
                    setEditingRoom(room);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.dangerButton}
                  style={{ padding: "6px 14px", fontSize: "12.5px" }}
                  onClick={async () => {
                    if (confirm(`Hapus ruang "${room.title}" beserta seluruh pesannya?`)) {
                      await deleteMessageRoomAction(room.id);
                      setRooms(rooms.filter((r) => r.id !== room.id));
                      showToast("success", "Ruang pesan dihapus");
                      router.refresh();
                    }
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
