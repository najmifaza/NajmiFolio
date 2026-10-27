"use client";

import { deleteExperienceAction, moveOrderAction } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.scss";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import ExperienceForm from "@/app/admin/forms/ExperienceForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExperiencesManager({
  initialExperiences,
}: {
  initialExperiences: any[];
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [experiences, setExperiences] = useState<any[]>(initialExperiences);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);
  const [isCreatingExperience, setIsCreatingExperience] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    setExperiences(initialExperiences);
  }, [initialExperiences]);

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    if (movingId) return;
    setMovingId(id);

    setExperiences((prev) => {
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
      await moveOrderAction("experience", id, direction);
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
          <h1>Work & Organization Experiences</h1>
          <p>Kelola riwayat karir, kepanitiaan, dan pencapaian profesional.</p>
        </div>
        {!isCreatingExperience && !editingExperience && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setEditingExperience(null);
              setIsCreatingExperience(true);
            }}
          >
            + Tambah Pengalaman
          </button>
        )}
      </div>

      {isCreatingExperience || editingExperience ? (
        <ExperienceForm
          experience={editingExperience}
          onCancel={() => {
            setIsCreatingExperience(false);
            setEditingExperience(null);
          }}
          onSave={() => {
            setIsCreatingExperience(false);
            setEditingExperience(null);
            showToast("success", "Pengalaman berhasil disimpan!");
            router.refresh();
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {experiences.map((exp: any, index: number) => {
            const idTrans = exp.translations?.find((t: any) => t.locale === "id") || {};
            return (
              <div key={exp.id} className={styles.itemCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <OrderButtons
                    order={exp.order ?? index + 1}
                    isFirst={index === 0}
                    isLast={index === experiences.length - 1}
                    disabled={movingId !== null}
                    onUp={() => handleMoveOrder(exp.id, "up")}
                    onDown={() => handleMoveOrder(exp.id, "down")}
                  />
                  <div>
                    <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                      {exp.company}
                    </div>
                    <div
                      style={{
                        fontSize: "12.5px",
                        color: "rgba(255,255,255,0.45)",
                        marginTop: 2,
                      }}
                    >
                      {idTrans.role} • {exp.timeframe}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setIsCreatingExperience(false);
                      setEditingExperience(exp);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={async () => {
                      if (confirm(`Hapus pengalaman ${exp.company}?`)) {
                        await deleteExperienceAction(exp.id);
                        setExperiences(experiences.filter((e: any) => e.id !== exp.id));
                        showToast("success", "Pengalaman berhasil dihapus");
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
