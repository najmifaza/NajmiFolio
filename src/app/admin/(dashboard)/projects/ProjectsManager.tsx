"use client";

import { deleteProjectAction, moveOrderAction } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.scss";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import ProjectForm from "@/app/admin/forms/ProjectForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectsManager({ initialProjects }: { initialProjects: any[] }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    if (movingId) return;
    setMovingId(id);

    setProjects((prev) => {
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
      await moveOrderAction("project", id, direction);
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
          <h1>Projects Manager</h1>
          <p>Kelola portofolio karya, media cover CDN, dan terjemahan otomatis.</p>
        </div>
        {!isCreatingProject && !editingProject && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setEditingProject(null);
              setIsCreatingProject(true);
            }}
          >
            + Tambah Project Baru
          </button>
        )}
      </div>

      {isCreatingProject || editingProject ? (
        <ProjectForm
          project={editingProject}
          onCancel={() => {
            setIsCreatingProject(false);
            setEditingProject(null);
          }}
          onSave={(savedProject) => {
            setIsCreatingProject(false);
            setEditingProject(null);
            showToast("success", `Project "${savedProject.slug}" berhasil disimpan!`);
            router.refresh();
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {projects.map((proj, index: number) => {
            const idTrans = proj.translations?.find((t: any) => t.locale === "id") || {};
            const enTrans = proj.translations?.find((t: any) => t.locale === "en") || {};
            const coverImg = Array.isArray(proj.images) ? proj.images[0] : "";

            return (
              <div key={proj.id} className={styles.itemCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
                  <OrderButtons
                    order={proj.order ?? index + 1}
                    isFirst={index === 0}
                    isLast={index === projects.length - 1}
                    disabled={movingId !== null}
                    onUp={() => handleMoveOrder(proj.id, "up")}
                    onDown={() => handleMoveOrder(proj.id, "down")}
                  />
                  {coverImg ? (
                    coverImg.endsWith(".webm") ? (
                      <video
                        src={coverImg}
                        muted
                        autoPlay
                        loop
                        playsInline
                        style={{
                          width: 80,
                          height: 52,
                          objectFit: "cover",
                          borderRadius: 6,
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <img
                        src={coverImg}
                        alt={proj.slug}
                        style={{
                          width: 80,
                          height: 52,
                          objectFit: "cover",
                          borderRadius: 6,
                          flexShrink: 0,
                        }}
                      />
                    )
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 52,
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.2)",
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      No Media
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                        {idTrans.title || proj.slug}
                      </span>
                      {proj.featured && (
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            background: "rgba(59, 130, 246, 0.2)",
                            color: "#93c5fd",
                            fontWeight: 600,
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)" }}>
                      <code>#{proj.order ?? 0}</code> • <code>/{proj.slug}</code>{" "}
                      {proj.publishedAt &&
                        `• ${new Date(proj.publishedAt).toISOString().split("T")[0]}`}{" "}
                      {enTrans.title && `• EN: ${enTrans.title}`}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setIsCreatingProject(false);
                      setEditingProject(proj);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={async () => {
                      if (confirm(`Yakin hapus project ${proj.slug}?`)) {
                        await deleteProjectAction(proj.id);
                        setProjects(projects.filter((p) => p.id !== proj.id));
                        showToast("success", "Project berhasil dihapus");
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
