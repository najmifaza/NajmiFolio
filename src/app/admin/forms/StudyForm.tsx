"use client";

import type React from "react";
import { useState } from "react";
import { type SaveStudyInput, saveStudyAction, translateAction } from "../actions";
import styles from "../admin.module.scss";

export default function StudyForm({ study, onCancel, onSave }: any) {
  const idTrans = study?.translations?.find((t: any) => t.locale === "id") || {};
  const enTrans = study?.translations?.find((t: any) => t.locale === "en") || {};

  const [institution, setInstitution] = useState(study?.institution || "");
  const [timeframe, setTimeframe] = useState(study?.timeframe || "");
  const [order, setOrder] = useState(study?.order ?? 1);

  const [idDegree, setIdDegree] = useState(idTrans.degree || "");
  const [idDescription, setIdDescription] = useState(idTrans.description || "");

  const [enDegree, setEnDegree] = useState(enTrans.degree || "");
  const [enDescription, setEnDescription] = useState(enTrans.description || "");

  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      if (idDegree) setEnDegree((await translateAction(idDegree, "id", "en")).result);
      if (idDescription)
        setEnDescription((await translateAction(idDescription, "id", "en")).result);
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: SaveStudyInput = {
        id: study?.id,
        institution,
        timeframe,
        order: Number(order) || 0,
        idDegree,
        idDescription,
        enDegree,
        enDescription,
      };

      await saveStudyAction(payload);
      onSave();
    } catch (err: any) {
      alert(`Gagal menyimpan riwayat studi: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.glassCard}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "22px" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 100px", gap: "16px" }}>
          <div className={styles.formGroup}>
            <label>Institusi Pendidikan *</label>
            <input
              className={styles.formInput}
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Universitas Jenderal Soedirman"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Periode Waktu *</label>
            <input
              className={styles.formInput}
              required
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="2024 - Sekarang"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Urutan</label>
            <input
              className={styles.formInput}
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Bilingual Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff", margin: 0 }}>
              Gelar & Deskripsi Pendidikan (Bilingual)
            </h3>
            <button
              type="button"
              className={styles.actionButton}
              onClick={handleAutoTranslate}
              disabled={translating}
            >
              {translating ? "Menerjemahkan..." : "✨ Auto-Translate ID ke EN"}
            </button>
          </div>

          <div className={styles.bilingualGrid}>
            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>🇮🇩 Bahasa Indonesia</div>
              <div className={styles.formGroup}>
                <label>Gelar / Program Studi *</label>
                <input
                  className={styles.formInput}
                  required
                  value={idDegree}
                  onChange={(e) => setIdDegree(e.target.value)}
                  placeholder="S1 Informatika"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Deskripsi / Fokus Akademik</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 90 }}
                  value={idDescription}
                  onChange={(e) => setIdDescription(e.target.value)}
                  placeholder="Fokus pada rekayasa perangkat lunak dan sistem informasi..."
                />
              </div>
            </div>

            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>🇬🇧 English</div>
              <div className={styles.formGroup}>
                <label>Degree / Program</label>
                <input
                  className={styles.formInput}
                  value={enDegree}
                  onChange={(e) => setEnDegree(e.target.value)}
                  placeholder="Bachelor of Informatics"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description / Academic Focus</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 90 }}
                  value={enDescription}
                  onChange={(e) => setEnDescription(e.target.value)}
                  placeholder="Focusing on software engineering and information systems..."
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 18,
          }}
        >
          <button type="button" className={styles.secondaryButton} onClick={onCancel}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={styles.primaryButton}>
            {saving ? "Menyimpan..." : "Simpan Riwayat Studi"}
          </button>
        </div>
      </form>
    </div>
  );
}
