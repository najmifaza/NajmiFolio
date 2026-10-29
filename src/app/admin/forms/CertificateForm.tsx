"use client";

import { Button, Column, Heading, Input, Row, Text } from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";
import { type SaveCertificateInput, saveCertificateAction, uploadMediaAction } from "../actions";

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
    <Column
      background="surface"
      border="neutral-alpha-weak"
      radius="l"
      padding="24"
      gap="24"
      fillWidth
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}
      >
        <Heading as="h2" variant="heading-strong-s" onBackground="neutral-strong">
          {cert ? "Edit Sertifikat" : "Tambah Sertifikat Baru"}
        </Heading>

        <Row gap="16" wrap fillWidth>
          <Column gap="8" style={{ flex: 1, minWidth: 220 }}>
            <Input
              id="cert-title"
              label="Judul Sertifikat *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 180 }}>
            <Input
              id="cert-issuer"
              label="Penerbit (Issuer) *"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="IBM / Dicoding / BEM-U"
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 150 }}>
            <Input
              id="cert-date"
              label="Periode / Tanggal"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Nov 2025"
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 200 }}>
            <Input
              id="cert-url"
              label="Credential URL (Opsional)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://credly.com/... atau https://dicoding.com/..."
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 120 }}>
            <Input
              id="cert-order"
              label="Urutan Tampil"
              type="number"
              value={String(order)}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
          </Column>
        </Row>

        {/* Certificate Image Upload */}
        <Column gap="8" fillWidth>
          <Text variant="label-default-s" onBackground="neutral-medium">
            File / Gambar Sertifikat (CDN) *
          </Text>
          <Row vertical="center" gap="16" wrap>
            {image && (
              <img
                src={image}
                alt="Preview"
                style={{
                  width: 90,
                  height: 60,
                  objectFit: "contain",
                  background: "var(--neutral-alpha-weak)",
                  border: "1px solid var(--border-neutral-alpha-weak)",
                  borderRadius: 6,
                  padding: 4,
                }}
              />
            )}
            <label
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-m)",
                background: "var(--neutral-alpha-weak)",
                border: "1px solid var(--border-neutral-alpha-medium)",
                color: "var(--neutral-on-background-strong)",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: 500,
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
          </Row>
        </Column>

        <Row horizontal="end" gap="12" paddingTop="16" borderTop="neutral-alpha-weak">
          <Button type="button" variant="secondary" size="m" label="Batal" onClick={onCancel} />
          <Button
            type="submit"
            variant="primary"
            size="m"
            label={saving ? "Menyimpan..." : "Simpan Sertifikat"}
            disabled={saving}
            loading={saving}
          />
        </Row>
      </form>
    </Column>
  );
}
