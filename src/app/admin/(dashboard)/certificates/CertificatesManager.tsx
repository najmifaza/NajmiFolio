"use client";

import { deleteCertificateAction, moveOrderAction } from "@/app/admin/actions";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import CertificateForm from "@/app/admin/forms/CertificateForm";
import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CertificatesManager({
  initialCertificates,
}: {
  initialCertificates: any[];
}) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [certificates, setCertificates] = useState<any[]>(initialCertificates);
  const [editingCertificate, setEditingCertificate] = useState<any | null>(null);
  const [isCreatingCertificate, setIsCreatingCertificate] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    setCertificates(initialCertificates);
  }, [initialCertificates]);

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    if (movingId) return;
    setMovingId(id);

    setCertificates((prev) => {
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
      await moveOrderAction("certificate", id, direction);
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
            Certificates & Licenses
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Kelola sertifikasi keahlian dan bukti badge kredensial.
          </Text>
        </Column>
        {!isCreatingCertificate && !editingCertificate && (
          <Button
            type="button"
            variant="primary"
            size="m"
            label="+ Tambah Sertifikat"
            onClick={() => {
              setEditingCertificate(null);
              setIsCreatingCertificate(true);
            }}
          />
        )}
      </Row>

      {isCreatingCertificate || editingCertificate ? (
        <CertificateForm
          cert={editingCertificate}
          onCancel={() => {
            setIsCreatingCertificate(false);
            setEditingCertificate(null);
          }}
          onSave={() => {
            setIsCreatingCertificate(false);
            setEditingCertificate(null);
            showToast("success", "Sertifikat berhasil disimpan!");
            router.refresh();
          }}
        />
      ) : (
        <Column gap="12" fillWidth>
          {certificates.map((cert: any, index: number) => (
            <Row
              key={cert.id}
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
                  order={cert.order ?? index + 1}
                  isFirst={index === 0}
                  isLast={index === certificates.length - 1}
                  disabled={movingId !== null}
                  onUp={() => handleMoveOrder(cert.id, "up")}
                  onDown={() => handleMoveOrder(cert.id, "down")}
                />
                {cert.image && (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    style={{
                      width: 60,
                      height: 42,
                      objectFit: "contain",
                      background: "var(--neutral-alpha-weak)",
                      border: "1px solid var(--border-neutral-alpha-weak)",
                      borderRadius: 6,
                      padding: 2,
                      flexShrink: 0,
                    }}
                  />
                )}
                <Column gap="2" style={{ minWidth: 0 }}>
                  <Text variant="heading-strong-xs" onBackground="neutral-strong">
                    {cert.title}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {cert.issuer} • {cert.date}
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
                    setIsCreatingCertificate(false);
                    setEditingCertificate(cert);
                  }}
                />
                <Button
                  type="button"
                  variant="danger"
                  size="s"
                  label="Hapus"
                  onClick={async () => {
                    if (confirm(`Hapus sertifikat ${cert.title}?`)) {
                      await deleteCertificateAction(cert.id);
                      setCertificates(certificates.filter((c: any) => c.id !== cert.id));
                      showToast("success", "Sertifikat dihapus");
                      router.refresh();
                    }
                  }}
                />
              </Row>
            </Row>
          ))}
        </Column>
      )}
    </Column>
  );
}
