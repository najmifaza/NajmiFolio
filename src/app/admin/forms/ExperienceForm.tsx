"use client";

import type React from "react";
import { useState } from "react";
import { type SaveExperienceInput, saveExperienceAction, translateAction } from "../actions";
import styles from "../admin.module.scss";

export default function ExperienceForm({ experience, onCancel, onSave }: any) {
  const idTrans = experience?.translations?.find((t: any) => t.locale === "id") || {};
  const enTrans = experience?.translations?.find((t: any) => t.locale === "en") || {};

  const [company, setCompany] = useState(experience?.company || "");
  const [timeframe, setTimeframe] = useState(experience?.timeframe || "");
  const [order, setOrder] = useState(experience?.order ?? 1);

  const [idRole, setIdRole] = useState(idTrans.role || "");
  const [idAchievementsStr, setIdAchievementsStr] = useState(
    Array.isArray(idTrans.achievements) ? idTrans.achievements.join("\n") : "",
  );

  const [enRole, setEnRole] = useState(enTrans.role || "");
  const [enAchievementsStr, setEnAchievementsStr] = useState(
    Array.isArray(enTrans.achievements) ? enTrans.achievements.join("\n") : "",
  );

  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      if (idRole) setEnRole((await translateAction(idRole, "id", "en")).result);
      if (idAchievementsStr) {
        const lines = idAchievementsStr.split("\n").filter((l: string) => l.trim().length > 0);
        const translatedLines = await Promise.all(
          lines.map(async (line: string) => (await translateAction(line, "id", "en")).result),
        );
        setEnAchievementsStr(translatedLines.join("\n"));
      }
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: SaveExperienceInput = {
        id: experience?.id,
        company,
        timeframe,
        order: Number(order),
        idRole,
        idAchievements: idAchievementsStr.split("\n").filter((l: string) => l.trim().length > 0),
        enRole: enRole || idRole,
        enAchievements: enAchievementsStr.split("\n").filter((l: string) => l.trim().length > 0),
      };

      await saveExperienceAction(payload);
      onSave();
    } catch (err: any) {
      alert(`Gagal simpan pengalaman: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.glassCard}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "#fff" }}>
          {experience ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
        </h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Perusahaan / Organisasi *</label>
            <input
              className={styles.formInput}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Timeframe (Periode) *</label>
            <input
              className={styles.formInput}
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="Jan 2026 - Present"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Urutan Tampil (Order)</label>
            <input
              className={styles.formInput}
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
              Urutan 1–8: Work Experience. Urutan 9+: Organization & Committee.
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
              Peran & Poin Pencapaian
            </span>
            <button
              type="button"
              className={styles.aiButton}
              onClick={handleAutoTranslate}
              disabled={translating}
            >
              {translating ? "Translating..." : "✨ Auto-Translate ID ke EN"}
            </button>
          </div>

          <div className={styles.bilingualContainer}>
            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>🇮🇩 Indonesia</div>
              <div className={styles.formGroup}>
                <label>Role / Jabatan *</label>
                <input
                  className={styles.formInput}
                  value={idRole}
                  onChange={(e) => setIdRole(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Pencapaian (1 baris per poin)</label>
                <textarea
                  className={styles.formTextarea}
                  value={idAchievementsStr}
                  onChange={(e) => setIdAchievementsStr(e.target.value)}
                  placeholder="Mengembangkan sistem XYZ..."
                />
              </div>
            </div>

            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>🇬🇧 English</div>
              <div className={styles.formGroup}>
                <label>Role / Position</label>
                <input
                  className={styles.formInput}
                  value={enRole}
                  onChange={(e) => setEnRole(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Achievements (1 per line)</label>
                <textarea
                  className={styles.formTextarea}
                  value={enAchievementsStr}
                  onChange={(e) => setEnAchievementsStr(e.target.value)}
                  placeholder="Developed XYZ system..."
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
          <button
            type="button"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontSize: "13.5px",
              cursor: "pointer",
            }}
            onClick={onCancel}
          >
            Batal
          </button>
          <button type="submit" disabled={saving} className={styles.primaryButton}>
            {saving ? "Menyimpan..." : "Simpan Pengalaman"}
          </button>
        </div>
      </form>
    </div>
  );
}
