"use client";

import { deleteProjectAction, moveOrderAction } from "@/app/admin/actions";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import ProjectForm from "@/app/admin/forms/ProjectForm";
import { Badge, Button, Column, Heading, Row, Text } from "@once-ui-system/core";
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
            Projects Manager
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Kelola portofolio karya, media cover CDN, dan terjemahan otomatis.
          </Text>
        </Column>
        {!isCreatingProject && !editingProject && (
          <Button
            type="button"
            variant="primary"
            size="m"
            label="+ Tambah Project Baru"
            onClick={() => {
              setEditingProject(null);
              setIsCreatingProject(true);
            }}
          />
        )}
      </Row>

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
        <Column gap="12" fillWidth>
          {projects.map((proj, index: number) => {
            const idTrans = proj.translations?.find((t: any) => t.locale === "id") || {};
            const enTrans = proj.translations?.find((t: any) => t.locale === "en") || {};
            const coverImg = Array.isArray(proj.images) ? proj.images[0] : "";

            return (
              <Row
                key={proj.id}
                vertical="center"
                horizontal="between"
                paddingX="16"
                paddingY="12"
                radius="m"
                background="surface"
                border="neutral-alpha-weak"
                gap="16"
                className="admin-card-row"
                style={{ transition: "all 0.15s ease" }}
              >
                <Row vertical="center" gap="16" style={{ minWidth: 0, flex: "1 1 auto" }}>
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
                        className="admin-card-media"
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
                        className="admin-card-media"
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
                    <Row
                      center
                      style={{
                        width: 80,
                        height: 52,
                        borderRadius: 6,
                        background: "var(--neutral-alpha-weak)",
                        color: "var(--neutral-on-background-weak)",
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      No Media
                    </Row>
                  )}
                  <Column gap="4" style={{ minWidth: 0, flex: 1 }}>
                    <Row vertical="center" gap="8" wrap>
                      <Text variant="heading-strong-xs" onBackground="neutral-strong">
                        {idTrans.title || proj.slug}
                      </Text>
                      {proj.featured && (
                        <Text
                          variant="label-default-xs"
                          style={{
                            padding: "2px 8px",
                            borderRadius: 12,
                            background: "var(--brand-alpha-weak)",
                            color: "var(--brand-on-background-medium)",
                            fontWeight: 600,
                          }}
                        >
                          Featured
                        </Text>
                      )}
                    </Row>
                    <Text variant="body-default-xs" onBackground="neutral-weak" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <code>#{proj.order ?? 0}</code> • <code>/{proj.slug}</code>{" "}
                      {proj.publishedAt &&
                        `• ${new Date(proj.publishedAt).toISOString().split("T")[0]}`}{" "}
                      {enTrans.title && `• EN: ${enTrans.title}`}
                    </Text>
                  </Column>
                </Row>

                <Row vertical="center" gap="8" className="admin-card-actions" style={{ flexShrink: 0 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="s"
                    label="Edit"
                    onClick={() => {
                      setIsCreatingProject(false);
                      setEditingProject(proj);
                    }}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="s"
                    label="Hapus"
                    onClick={async () => {
                      if (confirm(`Yakin hapus project ${proj.slug}?`)) {
                        await deleteProjectAction(proj.id);
                        setProjects(projects.filter((p) => p.id !== proj.id));
                        showToast("success", "Project berhasil dihapus");
                        router.refresh();
                      }
                    }}
                  />
                </Row>
              </Row>
            );
          })}
        </Column>
      )}
    </Column>
  );
}
