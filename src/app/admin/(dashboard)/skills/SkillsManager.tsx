"use client";

import { deleteSkillGroupAction, moveOrderAction } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.scss";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import SkillGroupForm from "@/app/admin/forms/SkillGroupForm";
import { UniversalIcon, resolveIconifyName } from "@/resources/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SkillsManager({ initialSkills }: { initialSkills: any[] }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [skills, setSkills] = useState<any[]>(initialSkills);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    if (movingId) return;
    setMovingId(id);

    setSkills((prev) => {
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
      await moveOrderAction("skillGroup", id, direction);
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
          <h1>Technical Skills</h1>
          <p>Kelola kelompok keahlian teknologi dan tag skill.</p>
        </div>
        {!isCreatingSkill && !editingSkill && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setEditingSkill(null);
              setIsCreatingSkill(true);
            }}
          >
            + Tambah Kelompok Skill
          </button>
        )}
      </div>

      {isCreatingSkill || editingSkill ? (
        <SkillGroupForm
          skillGroup={editingSkill}
          onCancel={() => {
            setIsCreatingSkill(false);
            setEditingSkill(null);
          }}
          onSave={() => {
            setIsCreatingSkill(false);
            setEditingSkill(null);
            showToast("success", "Kelompok skill berhasil disimpan!");
            router.refresh();
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {skills.map((sg: any, index: number) => {
            const idTrans = sg.translations?.find((t: any) => t.locale === "id") || {};
            const skillList = Array.isArray(sg.skills)
              ? sg.skills.map((s: any) => (typeof s === "string" ? s : s.name))
              : [];
            return (
              <div key={sg.id} className={styles.itemCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <OrderButtons
                    order={sg.order ?? index + 1}
                    isFirst={index === 0}
                    isLast={index === skills.length - 1}
                    disabled={movingId !== null}
                    onUp={() => handleMoveOrder(sg.id, "up")}
                    onDown={() => handleMoveOrder(sg.id, "down")}
                  />
                  <div>
                    <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                      {idTrans.title || sg.title}
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: 6 }}>
                      {skillList.map((tag: string) => (
                        <span
                          key={tag}
                          className={styles.langPill}
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <UniversalIcon name={resolveIconifyName(tag)} size={14} color="#34d399" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setIsCreatingSkill(false);
                      setEditingSkill(sg);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={async () => {
                      if (confirm(`Hapus kelompok skill ${sg.title}?`)) {
                        await deleteSkillGroupAction(sg.id);
                        setSkills(skills.filter((s: any) => s.id !== sg.id));
                        showToast("success", "Kelompok skill dihapus");
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
