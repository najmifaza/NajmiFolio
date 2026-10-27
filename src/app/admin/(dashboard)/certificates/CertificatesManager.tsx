"use client";

import { deleteCertificateAction, moveOrderAction } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.scss";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import OrderButtons from "@/app/admin/components/OrderButtons";
import CertificateForm from "@/app/admin/forms/CertificateForm";
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
    <div>
      <div className={styles.contentHeader}>
        <div className={styles.pageTitleGroup}>
          <h1>Certificates & Licenses</h1>
          <p>Kelola sertifikasi keahlian dan bukti badge kredensial.</p>
        </div>
        {!isCreatingCertificate && !editingCertificate && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setEditingCertificate(null);
              setIsCreatingCertificate(true);
            }}
          >
            + Tambah Sertifikat
          </button>
        )}
      </div>

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
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {certificates.map((cert: any, index: number) => (
            <div key={cert.id} className={styles.itemCard}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 6,
                      padding: 2,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div>
                  <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                    {cert.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "rgba(255,255,255,0.45)",
                      marginTop: 2,
                    }}
                  >
                    {cert.issuer} • {cert.date}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setIsCreatingCertificate(false);
                    setEditingCertificate(cert);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={async () => {
                    if (confirm(`Hapus sertifikat ${cert.title}?`)) {
                      await deleteCertificateAction(cert.id);
                      setCertificates(certificates.filter((c: any) => c.id !== cert.id));
                      showToast("success", "Sertifikat dihapus");
                      router.refresh();
                    }
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
