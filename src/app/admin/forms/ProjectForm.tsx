"use client";

import type React from "react";
import { useState } from "react";
import {
  type SaveProjectInput,
  saveProjectAction,
  translateAction,
  uploadMediaAction,
} from "../actions";
import styles from "../admin.module.scss";

export default function ProjectForm({
  project,
  onCancel,
  onSave,
}: {
  project?: any;
  onCancel: () => void;
  onSave: (proj: any) => void;
}) {
  const idTrans = project?.translations?.find((t: any) => t.locale === "id") || {};
  const enTrans = project?.translations?.find((t: any) => t.locale === "en") || {};

  const [slug, setSlug] = useState(project?.slug || "");
  const [order, setOrder] = useState<number>(project?.order ?? 1);
  const [publishedAt, setPublishedAt] = useState<string>(
    project?.publishedAt
      ? new Date(project.publishedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
  const [link, setLink] = useState(project?.link || "");
  const [github, setGithub] = useState(project?.github || "");
  const [featured, setFeatured] = useState(project?.featured || false);
  const [images, setImages] = useState<string[]>(
    Array.isArray(project?.images) ? project.images : [],
  );

  const [idTitle, setIdTitle] = useState(idTrans.title || "");
  const [idSummary, setIdSummary] = useState(idTrans.summary || "");
  const [idContent, setIdContent] = useState(idTrans.content || "");

  const [enTitle, setEnTitle] = useState(enTrans.title || "");
  const [enSummary, setEnSummary] = useState(enTrans.summary || "");
  const [enContent, setEnContent] = useState(enTrans.content || "");

  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadMediaAction(formData);
    if (res.success && res.url) {
      setImages([...images, res.url]);
    } else {
      alert(`Upload gagal: ${res.error || "Unknown error"}`);
    }
    setUploading(false);
  };

  const handleAutoTranslate = async () => {
    if (!idTitle && !idSummary && !idContent) {
      alert("Isi teks bahasa Indonesia terlebih dahulu!");
      return;
    }

    setTranslating(true);
    try {
      if (idTitle) {
        const res = await translateAction(idTitle, "id", "en");
        if (res.success) setEnTitle(res.result);
      }
      if (idSummary) {
        const res = await translateAction(idSummary, "id", "en");
        if (res.success) setEnSummary(res.result);
      }
      if (idContent) {
        const res = await translateAction(idContent, "id", "en");
        if (res.success) setEnContent(res.result);
      }
    } catch (err: any) {
      alert(`Gagal translate: ${err.message}`);
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !idTitle) {
      alert("Slug dan Judul (ID) wajib diisi!");
      return;
    }

    setSaving(true);
    try {
      const payload: SaveProjectInput = {
        id: project?.id,
        slug,
        link: link || undefined,
        github: github || undefined,
        featured,
        order: Number(order) || 0,
        publishedAt: publishedAt || undefined,
        images,
        idTitle,
        idSummary,
        idContent,
        enTitle: enTitle || undefined,
        enSummary: enSummary || undefined,
        enContent: enContent || undefined,
      };

      const res = await saveProjectAction(payload);
      if (res.success) {
        onSave(res.project);
      }
    } catch (err: any) {
      alert(`Gagal menyimpan project: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.glassCard}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "#fff" }}>
          {project ? `Edit Project: ${project.slug}` : "Tambah Project Baru"}
        </h2>

        {/* Basic fields */}
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Slug URL *</label>
            <input
              className={styles.formInput}
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="contoh: platform-properti-rumio"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Urutan Tampil (Order) *</label>
            <input
              type="number"
              className={styles.formInput}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Tanggal Rilis / Publikasi *</label>
            <input
              type="date"
              className={styles.formInput}
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Live Demo URL (Website)</label>
            <input
              className={styles.formInput}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>GitHub Repository URL</label>
            <input
              className={styles.formInput}
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="proj-featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            style={{ width: 16, height: 16, cursor: "pointer" }}
          />
          <label
            htmlFor="proj-featured"
            style={{ cursor: "pointer", fontSize: 13.5, color: "rgba(255,255,255,0.8)" }}
          >
            Jadikan Featured Project (tampil di badge teratas Halaman Utama)
          </label>
        </div>

        {/* Media Upload Area */}
        <div className={styles.formGroup}>
          <label>Cover & Media Galeri (Supabase Storage)</label>
          <label className={styles.uploadZone}>
            <span style={{ fontSize: 24 }}>☁️</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#93c5fd" }}>
              {uploading ? "Sedang Mengunggah File ke Supabase..." : "Klik untuk Upload Media Baru"}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              Mendukung WebP, PNG, JPG, dan video WebM (maksimal 50MB)
            </span>
            <input
              type="file"
              accept="image/*,video/webm"
              style={{ display: "none" }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>

          {images.length > 0 && (
            <div className={styles.mediaThumbGrid}>
              {images.map((url, idx) => (
                <div key={url || `img-${idx}`} className={styles.mediaThumbItem}>
                  {url.endsWith(".webm") ? (
                    <video
                      src={url}
                      muted
                      autoPlay
                      loop
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <img src={url} alt="thumbnail" />
                  )}
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bilingual Content Editor */}
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
              Konten & Deskripsi Bilingual
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
            {/* ID */}
            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>
                <span>🇮🇩</span> Bahasa Indonesia (Utama)
              </div>
              <div className={styles.formGroup}>
                <label>Judul Proyek *</label>
                <input
                  className={styles.formInput}
                  value={idTitle}
                  onChange={(e) => setIdTitle(e.target.value)}
                  placeholder="Judul dalam bahasa Indonesia"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ringkasan Singkat (Summary)</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 80 }}
                  value={idSummary}
                  onChange={(e) => setIdSummary(e.target.value)}
                  placeholder="Ringkasan singkat untuk card..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Konten Detail (Markdown / MDX)</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 220, fontFamily: "monospace", fontSize: 13 }}
                  value={idContent}
                  onChange={(e) => setIdContent(e.target.value)}
                  placeholder="# Arsitektur Sistem..."
                />
              </div>
            </div>

            {/* EN */}
            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>
                <span>🇬🇧</span> English Version
              </div>
              <div className={styles.formGroup}>
                <label>Project Title (EN)</label>
                <input
                  className={styles.formInput}
                  value={enTitle}
                  onChange={(e) => setEnTitle(e.target.value)}
                  placeholder="Auto-translated or manual title"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Summary (EN)</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 80 }}
                  value={enSummary}
                  onChange={(e) => setEnSummary(e.target.value)}
                  placeholder="Short summary in English..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Content Detail (Markdown / MDX)</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 220, fontFamily: "monospace", fontSize: 13 }}
                  value={enContent}
                  onChange={(e) => setEnContent(e.target.value)}
                  placeholder="# System Architecture..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
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
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={onCancel}
          >
            Batal
          </button>
          <button type="submit" disabled={saving} className={styles.primaryButton}>
            {saving ? "Menyimpan..." : "Simpan Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
