"use client";

import { deleteAnonymousMessageAction } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.scss";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoomInboxView({ room }: { room: any }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [messages, setMessages] = useState<any[]>(room.messages || []);

  return (
    <div>
      <div className={styles.inboxHeader}>
        <Link
          href="/admin/rooms"
          className={styles.secondaryButton}
          style={{ textDecoration: "none" }}
        >
          <span>←</span>
          <span>Kembali ke Daftar Ruang</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <a
            href={`/${room.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.aiButton}
            style={{ textDecoration: "none" }}
          >
            <span>Buka Form Publik</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      <div className={styles.glassCard} style={{ marginBottom: "20px" }}>
        <div className={styles.inboxRoomMeta}>
          <div>
            <h2 className={styles.inboxRoomTitle}>{room.title}</h2>
            <div className={styles.inboxRoomSubtitle}>
              <span style={{ fontFamily: "monospace", color: "#38bdf8" }}>/{room.slug}</span>
              <span>•</span>
              <span
                className={`${styles.statusPill} ${
                  room.isActive ? styles.active : styles.inactive
                }`}
              >
                {room.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            {room.description && (
              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: "1.5",
                }}
              >
                {room.description}
              </p>
            )}
          </div>
          <div className={styles.inboxCountBadge}>{messages.length} Pesan Masuk</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 ? (
          <div
            className={styles.glassCard}
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "rgba(255,255,255,0.45)",
              fontSize: "13.5px",
            }}
          >
            Belum ada pesan anonim yang masuk untuk ruang ini.
          </div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg.id} className={styles.inboxMessageCard}>
              <div className={styles.inboxMessageHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    className={`${styles.inboxSenderPill} ${
                      !msg.senderTag ? styles.anonymous : ""
                    }`}
                  >
                    {msg.senderTag ? msg.senderTag : "Anonim"}
                  </span>
                  <span className={styles.inboxTimestamp}>
                    {new Date(msg.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={async () => {
                    if (confirm("Hapus pesan anonim ini?")) {
                      await deleteAnonymousMessageAction(msg.id);
                      setMessages((prev) => prev.filter((m: any) => m.id !== msg.id));
                      showToast("success", "Pesan berhasil dihapus");
                      router.refresh();
                    }
                  }}
                >
                  Hapus
                </button>
              </div>
              <p className={styles.inboxMessageBody}>{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
