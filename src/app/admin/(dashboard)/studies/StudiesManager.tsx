"use client";

import { deleteStudyAction, moveOrderAction } from "@/app/admin/actions";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import StudyForm from "@/app/admin/forms/StudyForm";
import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";
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
            Studies & Education
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Kelola riwayat pendidikan formal dan institusi.
          </Text>
        </Column>
        {!isCreatingStudy && !editingStudy && (
          <Button
            type="button"
            variant="primary"
            size="m"
            label="+ Tambah Riwayat Studi"
            onClick={() => {
              setEditingStudy(null);
              setIsCreatingStudy(true);
            }}
          />
        )}
      </Row>

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
        <Column gap="12" fillWidth>
          {studies.map((item: any, index: number) => {
            const idTrans = item.translations?.find((t: any) => t.locale === "id") || {};
            return (
              <Row
                key={item.id}
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
                    order={item.order ?? index + 1}
                    isFirst={index === 0}
                    isLast={index === studies.length - 1}
                    disabled={movingId !== null}
                    onUp={() => handleMoveOrder(item.id, "up")}
                    onDown={() => handleMoveOrder(item.id, "down")}
                  />
                  <Column gap="2" style={{ minWidth: 0, flex: 1 }}>
                    <Text variant="heading-strong-xs" onBackground="neutral-strong">
                      {item.institution}
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      <Text as="span" onBackground="brand-medium">{idTrans.degree || "Studi"}</Text>{" "}
                      • {item.timeframe}
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
                      setIsCreatingStudy(false);
                      setEditingStudy(item);
                    }}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="s"
                    label="Hapus"
                    onClick={async () => {
                      if (confirm(`Hapus riwayat studi ${item.institution}?`)) {
                        await deleteStudyAction(item.id);
                        setStudies(studies.filter((s: any) => s.id !== item.id));
                        showToast("success", "Riwayat studi dihapus");
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
