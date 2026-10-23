"use client";

import type React from "react";
import { useState } from "react";
import { type SaveCertificateInput, saveCertificateAction, uploadMediaAction } from "../actions";
import styles from "../admin.module.scss";

export default function CertificateForm({ cert, onCancel, onSave }: any) {
  const [title, setTitle] = useState(cert?.title || "");
  const [issuer, setIssuer] = useState(cert?.issuer || "");
  const [date, setDate] = useState(cert?.date || "");
  const [image, setImage] = useState(cert?.image || "");
  const [url, setUrl] = useState(cert?.url || "");
  const [order, setOrder] = useState(cert?.order ?? 1);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadMediaAction(formData);
    if (res.success && res.url) {
      setImage(res.url);
    } else {
      alert(`Upload sertifikat gagal: ${res.error || "Unknown error"}`);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer || !image) {
      alert("Judul, penerbit, dan gambar sertifikat wajib diisi!");
      return;
    }

    setSaving(true);
    try {
      const payload: SaveCertificateInput = {
        id: cert?.id,
        title,
        issuer,
        date,
        image,
        url: url || undefined,
        order: Number(order),
      };

      await saveCertificateAction(payload);
      onSave();
    } catch (err: any) {
      alert(`Gagal simpan sertifikat: ${err.message}`);
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
          {cert ? "Edit Sertifikat" : "Tambah Sertifikat Baru"}
        </h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Judul Sertifikat *</label>
            <input
              className={styles.formInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Penerbit (Issuer) *</label>
            <input
              className={styles.formInput}
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="IBM / Dicoding / BEM-U"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Periode / Tanggal</label>
            <input
              className={styles.formInput}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Nov 2025"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Credential URL (Opsional)</label>
            <input
              className={styles.formInput}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://credly.com/... atau https://dicoding.com/..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>Urutan Tampil</label>
            <input
              className={styles.formInput}
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Certificate Image Upload */}
        <div className={styles.formGroup}>
          <label>File / Gambar Sertifikat (CDN) *</label>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            {image && (
              <img
                src={image}
                alt="Preview"
                style={{
                  width: 90,
                  height: 60,
                  objectFit: "contain",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 6,
                  padding: 4,
                }}
              />
            )}
            <label
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {uploading ? "Mengunggah..." : "Upload Gambar Sertifikat"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUploadImage}
                disabled={uploading}
              />
            </label>
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
            {saving ? "Menyimpan..." : "Simpan Sertifikat"}
          </button>
        </div>
      </form>
    </div>
  );
}
