"use client";

import { UniversalIcon, resolveIconifyName } from "@/resources/icons";
import type React from "react";
import { useState } from "react";
import { type SaveSkillGroupInput, saveSkillGroupAction, translateAction } from "../actions";
import styles from "../admin.module.scss";

export default function SkillGroupForm({ skillGroup, onCancel, onSave }: any) {
  const idTrans = skillGroup?.translations?.find((t: any) => t.locale === "id") || {};
  const enTrans = skillGroup?.translations?.find((t: any) => t.locale === "en") || {};

  const [title, setTitle] = useState(skillGroup?.title || "");
  const [order, setOrder] = useState(skillGroup?.order ?? 1);

  const [idTitle, setIdTitle] = useState(idTrans.title || "");
  const [idDescription, setIdDescription] = useState(idTrans.description || "");

  const [enTitle, setEnTitle] = useState(enTrans.title || "");
  const [enDescription, setEnDescription] = useState(enTrans.description || "");

  const initialSkillsStr = Array.isArray(skillGroup?.skills)
    ? skillGroup.skills.map((s: any) => (typeof s === "string" ? s : s.name)).join(", ")
    : "Next.js, TypeScript, Tailwind CSS, PostgreSQL";

  const [skillsStr, setSkillsStr] = useState(initialSkillsStr);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      if (idTitle) setEnTitle((await translateAction(idTitle, "id", "en")).result);
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
      const skillsArray = skillsStr
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
        .map((name: string) => ({ name, icon: resolveIconifyName(name) }));

      const payload: SaveSkillGroupInput = {
        id: skillGroup?.id,
        title: title || idTitle,
        order: Number(order) || 0,
        skills: skillsArray,
        idTitle: idTitle || title,
        idDescription,
        enTitle,
        enDescription,
      };

      await saveSkillGroupAction(payload);
      onSave();
    } catch (err: any) {
      alert(`Gagal menyimpan skill: ${err.message}`);
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
        <div style={{ display: "grid", gridTemplateColumns: "2fr 100px", gap: "16px" }}>
          <div className={styles.formGroup}>
            <label>Identifier Nama Grup (Internal/Default) *</label>
            <input
              className={styles.formInput}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Web Development"
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

        <div className={styles.formGroup}>
          <label>Daftar Skills / Teknologi (Pisahkan dengan koma) *</label>
          <input
            className={styles.formInput}
            required
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="React, Next.js, TypeScript, Node.js, Prisma, MySQL"
          />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: 8 }}>
            {skillsStr
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
              .map((name: string) => (
                <span
                  key={name}
                  className={styles.langPill}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <UniversalIcon name={resolveIconifyName(name)} size={13} color="#34d399" />
                  {name}
                </span>
              ))}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
            Ketik nama teknologi, icon akan otomatis terdeteksi (Next.js, Python, Figma, SQL, dll).
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "12px 14px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span style={{ fontWeight: 600, color: "#fff" }}>
                📖 Dokumentasi & Pencarian 200.000+ Icon (Iconify):
              </span>
              <div style={{ display: "flex", gap: "12px" }}>
                <a
                  href="https://icon-sets.iconify.design/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#34d399", textDecoration: "underline", fontWeight: 500 }}
                >
                  Iconify Search Engine ↗
                </a>
                <a
                  href="https://simpleicons.org/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#34d399", textDecoration: "underline", fontWeight: 500 }}
                >
                  Simple Icons (Brand & Tech) ↗
                </a>
              </div>
            </div>
            <div>
              <strong>Cara Pakai:</strong>
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                <li>
                  <strong>Nama teknologi umum:</strong> Langsung ketik namanya (misal:{" "}
                  <code>React</code>, <code>Docker</code>, <code>Rust</code>,{" "}
                  <code>Kubernetes</code>, <code>Vue</code>, <code>FastAPI</code>,{" "}
                  <code>Redis</code>, <code>PostgreSQL</code>, <code>Prisma</code>,{" "}
                  <code>Tailwind CSS</code>, <code>Figma</code>) — icon otomatis terpasang.
                </li>
                <li>
                  <strong>Spesifik set Iconify:</strong> Bisa ketik ID icon apa pun dari katalog
                  Iconify (misal: <code>simple-icons:docker</code>, <code>lucide:cpu</code>,{" "}
                  <code>fa6-solid:server</code>, <code>tabler:terminal-2</code>).
                </li>
              </ul>
            </div>
            <div style={{ marginTop: 6, color: "#34d399", fontSize: "11px" }}>
              ✨ Seluruh icon diunduh on-demand tanpa perlu konfigurasi atau mendaftarkan kode lagi.
            </div>
          </div>
        </div>

        {/* Bilingual Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff", margin: 0 }}>
              Judul & Penjelasan Grup Skill (Bilingual)
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
                <label>Judul Kelompok *</label>
                <input
                  className={styles.formInput}
                  required
                  value={idTitle}
                  onChange={(e) => setIdTitle(e.target.value)}
                  placeholder="Pengembangan Web"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Deskripsi Tambahan</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 70 }}
                  value={idDescription}
                  onChange={(e) => setIdDescription(e.target.value)}
                  placeholder="Keahlian dalam membangun aplikasi web modern performa tinggi..."
                />
              </div>
            </div>

            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>🇬🇧 English</div>
              <div className={styles.formGroup}>
                <label>Group Title</label>
                <input
                  className={styles.formInput}
                  value={enTitle}
                  onChange={(e) => setEnTitle(e.target.value)}
                  placeholder="Web Development"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 70 }}
                  value={enDescription}
                  onChange={(e) => setEnDescription(e.target.value)}
                  placeholder="Proficiency in building high-performance modern web apps..."
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
            {saving ? "Menyimpan..." : "Simpan Kelompok Skill"}
          </button>
        </div>
      </form>
    </div>
  );
}
