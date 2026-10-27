"use client";

import { deleteStudyAction, moveOrderAction } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.scss";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import StudyForm from "@/app/admin/forms/StudyForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudiesManager({ initialStudies }: { initialStudies: any[] }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [studies, setStudies] = useState<any[]>(initialStudies);
  const [editingStudy, setEditingStudy] = useState<any | null>(null);
  const [isCreatingStudy, setIsCreatingStudy] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    setStudies(initialStudies);
  }, [initialStudies]);

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    if (movingId) return;
    setMovingId(id);

    setStudies((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, item);
      return copy.map((it, i) => ({ ...it, order: i + 1 }));
    });

    try {
      await moveOrderAction("study", id, direction);
    } catch {
      showToast("error", "Gagal memperbarui urutan");
      router.refresh();
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div>
      <div className={styles.contentHeader}>
        <div className={styles.pageTitleGroup}>
          <h1>Studies & Education</h1>
          <p>Kelola riwayat pendidikan formal dan institusi.</p>
        </div>
        {!isCreatingStudy && !editingStudy && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setEditingStudy(null);
              setIsCreatingStudy(true);
            }}
          >
            + Tambah Riwayat Studi
          </button>
        )}
      </div>

      {isCreatingStudy || editingStudy ? (
        <StudyForm
          study={editingStudy}
          onCancel={() => {
            setIsCreatingStudy(false);
            setEditingStudy(null);
          }}
          onSave={() => {
            setIsCreatingStudy(false);
            setEditingStudy(null);
            showToast("success", "Riwayat studi berhasil disimpan!");
            router.refresh();
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {studies.map((item: any, index: number) => {
            const idTrans = item.translations?.find((t: any) => t.locale === "id") || {};
            return (
              <div key={item.id} className={styles.itemCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <OrderButtons
                    order={item.order ?? index + 1}
                    isFirst={index === 0}
                    isLast={index === studies.length - 1}
                    disabled={movingId !== null}
                    onUp={() => handleMoveOrder(item.id, "up")}
                    onDown={() => handleMoveOrder(item.id, "down")}
                  />
                  <div>
                    <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                      {item.institution}
                    </div>
                    <div style={{ fontSize: "13px", color: "#34d399", marginTop: 2 }}>
                      {idTrans.degree || "Studi"} •{" "}
                      <span style={{ color: "rgba(255,255,255,0.45)" }}>{item.timeframe}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setIsCreatingStudy(false);
                      setEditingStudy(item);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={async () => {
                      if (confirm(`Hapus riwayat studi ${item.institution}?`)) {
                        await deleteStudyAction(item.id);
                        setStudies(studies.filter((s: any) => s.id !== item.id));
                        showToast("success", "Riwayat studi dihapus");
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
      )}
    </div>
  );
}
