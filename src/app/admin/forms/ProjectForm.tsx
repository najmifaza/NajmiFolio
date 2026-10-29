"use client";

import { Button, Column, Heading, Input, Row, Switch, Text, Textarea } from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";
import {
  type SaveProjectInput,
  saveProjectAction,
  translateAction,
  uploadMediaAction,
} from "../actions";

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
          {project ? `Edit Project: ${project.slug}` : "Tambah Project Baru"}
        </Heading>

        <Row gap="16" wrap fillWidth>
          <Column gap="8" style={{ flex: 1, minWidth: 200 }}>
            <Input
              id="proj-slug"
              label="Slug URL *"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="contoh: platform-properti-rumio"
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 140 }}>
            <Input
              id="proj-order"
              label="Urutan Tampil *"
              type="number"
              value={String(order)}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 160 }}>
            <Input
              id="proj-publishedAt"
              label="Tanggal Rilis *"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 200 }}>
            <Input
              id="proj-link"
              label="Live Demo URL"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 200 }}>
            <Input
              id="proj-github"
              label="GitHub Repository URL"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..."
            />
          </Column>
        </Row>

        <Row vertical="center" gap="12">
          <Switch
            isChecked={featured}
            onToggle={() => setFeatured(!featured)}
            label="Jadikan Featured Project (tampil di badge teratas Halaman Utama)"
          />
        </Row>

        {/* Media Upload Area */}
        <Column gap="8" fillWidth>
          <Text variant="label-default-s" onBackground="neutral-medium">
            Cover & Media Galeri (Supabase Storage)
          </Text>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: 22,
              border: "1px dashed var(--border-neutral-alpha-medium)",
              borderRadius: "var(--radius-m)",
              cursor: "pointer",
              background: "var(--neutral-alpha-weak)",
              transition: "all 0.15s ease",
            }}
          >
            <Text variant="label-strong-s" onBackground="brand-medium">
              {uploading ? "Sedang Mengunggah File ke Supabase..." : "Klik untuk Upload Media Baru"}
            </Text>
            <Text variant="label-default-xs" onBackground="neutral-weak">
              Mendukung WebP, PNG, JPG, dan video WebM (maksimal 50MB)
            </Text>
            <input
              type="file"
              accept="image/*,video/webm"
              style={{ display: "none" }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>

          {images.length > 0 && (
            <Row gap="12" wrap paddingTop="8">
              {images.map((url, idx) => (
                <Row
                  key={url || `img-${idx}`}
                  style={{
                    position: "relative",
                    width: 84,
                    height: 56,
                    borderRadius: 6,
                    overflow: "hidden",
                    border: "1px solid var(--border-neutral-alpha-medium)",
                    background: "var(--surface-background)",
                    flexShrink: 0,
                  }}
                >
                  {url.endsWith(".webm") ? (
                    <video
                      src={url}
                      muted
                      autoPlay
                      loop
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <img
                      src={url}
                      alt="thumbnail"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                  <Button
                    type="button"
                    variant="danger"
                    size="s"
                    label="✕"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    style={{
                      position: "absolute",
                      top: 3,
                      right: 3,
                      width: 18,
                      height: 18,
                      minWidth: "unset",
                      padding: 0,
                      fontSize: 10,
                    }}
                  />
                </Row>
              ))}
            </Row>
          )}
        </Column>

        {/* Bilingual Content Editor */}
        <Column gap="12" fillWidth>
          <Row vertical="center" horizontal="between">
            <Text variant="label-strong-m" onBackground="neutral-strong">
              Konten & Deskripsi Bilingual
            </Text>
            <Button
              type="button"
              variant="secondary"
              size="s"
              label={translating ? "Translating..." : "✨ Auto-Translate ID ke EN"}
              disabled={translating}
              onClick={handleAutoTranslate}
            />
          </Row>

          <Row gap="16" wrap fillWidth>
            {/* ID */}
            <Column
              gap="12"
              padding="16"
              radius="m"
              background="neutral-alpha-weak"
              border="neutral-alpha-weak"
              style={{ flex: 1, minWidth: 280 }}
            >
              <Text variant="label-strong-xs" onBackground="neutral-medium">
                🇮🇩 Bahasa Indonesia (Utama)
              </Text>
              <Input
                id="proj-id-title"
                label="Judul Proyek *"
                value={idTitle}
                onChange={(e) => setIdTitle(e.target.value)}
                placeholder="Judul dalam bahasa Indonesia"
                required
              />
              <Textarea
                id="proj-id-summary"
                label="Ringkasan Singkat (Summary)"
                value={idSummary}
                onChange={(e) => setIdSummary(e.target.value)}
                placeholder="Ringkasan singkat untuk card..."
                lines={3}
              />
              <Textarea
                id="proj-id-content"
                label="Konten Detail (Markdown / MDX)"
                value={idContent}
                onChange={(e) => setIdContent(e.target.value)}
                placeholder="# Arsitektur Sistem..."
                lines={8}
              />
            </Column>

            {/* EN */}
            <Column
              gap="12"
              padding="16"
              radius="m"
              background="neutral-alpha-weak"
              border="neutral-alpha-weak"
              style={{ flex: 1, minWidth: 280 }}
            >
              <Text variant="label-strong-xs" onBackground="neutral-medium">
                🇬🇧 English Version
              </Text>
              <Input
                id="proj-en-title"
                label="Project Title (EN)"
                value={enTitle}
                onChange={(e) => setEnTitle(e.target.value)}
                placeholder="Auto-translated or manual title"
              />
              <Textarea
                id="proj-en-summary"
                label="Summary (EN)"
                value={enSummary}
                onChange={(e) => setEnSummary(e.target.value)}
                placeholder="Short summary in English..."
                lines={3}
              />
              <Textarea
                id="proj-en-content"
                label="Content Detail (Markdown / MDX)"
                value={enContent}
                onChange={(e) => setEnContent(e.target.value)}
                placeholder="# System Architecture..."
                lines={8}
              />
            </Column>
          </Row>
        </Column>

        {/* Actions */}
        <Row horizontal="end" gap="12" paddingTop="16" borderTop="neutral-alpha-weak">
          <Button type="button" variant="secondary" size="m" label="Batal" onClick={onCancel} />
          <Button
            type="submit"
            variant="primary"
            size="m"
            label={saving ? "Menyimpan..." : "Simpan Project"}
            disabled={saving}
            loading={saving}
          />
        </Row>
      </form>
    </Column>
  );
}
