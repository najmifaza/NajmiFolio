"use client";

import { deleteExperienceAction, moveOrderAction } from "@/app/admin/actions";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import ExperienceForm from "@/app/admin/forms/ExperienceForm";
import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";
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
            Work & Organization Experiences
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Kelola riwayat karir, kepanitiaan, dan pencapaian profesional.
          </Text>
        </Column>
        {!isCreatingExperience && !editingExperience && (
          <Button
            type="button"
            variant="primary"
            size="m"
            label="+ Tambah Pengalaman"
            onClick={() => {
              setEditingExperience(null);
              setIsCreatingExperience(true);
            }}
          />
        )}
      </Row>

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
        <Column gap="12" fillWidth>
          {experiences.map((exp: any, index: number) => {
            const idTrans = exp.translations?.find((t: any) => t.locale === "id") || {};
            return (
              <Row
                key={exp.id}
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
                    order={exp.order ?? index + 1}
                    isFirst={index === 0}
                    isLast={index === experiences.length - 1}
                    disabled={movingId !== null}
                    onUp={() => handleMoveOrder(exp.id, "up")}
                    onDown={() => handleMoveOrder(exp.id, "down")}
                  />
                  <Column gap="2" style={{ minWidth: 0, flex: 1 }}>
                    <Text variant="heading-strong-xs" onBackground="neutral-strong">
                      {exp.company}
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {idTrans.role} • {exp.timeframe}
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
                      setIsCreatingExperience(false);
                      setEditingExperience(exp);
                    }}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="s"
                    label="Hapus"
                    onClick={async () => {
                      if (confirm(`Hapus pengalaman ${exp.company}?`)) {
                        await deleteExperienceAction(exp.id);
                        setExperiences(experiences.filter((e: any) => e.id !== exp.id));
                        showToast("success", "Pengalaman berhasil dihapus");
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
