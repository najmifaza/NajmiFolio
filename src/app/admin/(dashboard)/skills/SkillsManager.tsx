"use client";

import { deleteSkillGroupAction, moveOrderAction } from "@/app/admin/actions";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import SkillGroupForm from "@/app/admin/forms/SkillGroupForm";
import { UniversalIcon, resolveIconifyName } from "@/resources/icons";
import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";
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
            Technical Skills
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Kelola kelompok keahlian teknologi dan tag skill.
          </Text>
        </Column>
        {!isCreatingSkill && !editingSkill && (
          <Button
            type="button"
            variant="primary"
            size="m"
            label="+ Tambah Kelompok Skill"
            onClick={() => {
              setEditingSkill(null);
              setIsCreatingSkill(true);
            }}
          />
        )}
      </Row>

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
        <Column gap="12" fillWidth>
          {skills.map((sg: any, index: number) => {
            const idTrans = sg.translations?.find((t: any) => t.locale === "id") || {};
            const skillList = Array.isArray(sg.skills)
              ? sg.skills.map((s: any) => (typeof s === "string" ? s : s.name))
              : [];
            return (
              <Row
                key={sg.id}
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
                    order={sg.order ?? index + 1}
                    isFirst={index === 0}
                    isLast={index === skills.length - 1}
                    disabled={movingId !== null}
                    onUp={() => handleMoveOrder(sg.id, "up")}
                    onDown={() => handleMoveOrder(sg.id, "down")}
                  />
                  <Column gap="8" style={{ minWidth: 0, flex: 1 }}>
                    <Text variant="heading-strong-xs" onBackground="neutral-strong">
                      {idTrans.title || sg.title}
                    </Text>
                    <Row gap="8" wrap>
                      {skillList.map((tag: string) => (
                        <Row
                          key={tag}
                          vertical="center"
                          gap="8"
                          paddingX="8"
                          paddingY="4"
                          radius="m"
                          background="neutral-alpha-weak"
                          border="neutral-alpha-weak"
                        >
                          <UniversalIcon
                            name={resolveIconifyName(tag)}
                            size={13}
                            color="var(--brand-solid-strong)"
                          />
                          <Text variant="label-default-xs" onBackground="neutral-strong">
                            {tag}
                          </Text>
                        </Row>
                      ))}
                    </Row>
                  </Column>
                </Row>

                <Row vertical="center" gap="8" className="admin-card-actions" style={{ flexShrink: 0 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="s"
                    label="Edit"
                    onClick={() => {
                      setIsCreatingSkill(false);
                      setEditingSkill(sg);
                    }}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="s"
                    label="Hapus"
                    onClick={async () => {
                      if (confirm(`Hapus kelompok skill ${sg.title}?`)) {
                        await deleteSkillGroupAction(sg.id);
                        setSkills(skills.filter((s: any) => s.id !== sg.id));
                        showToast("success", "Kelompok skill dihapus");
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
