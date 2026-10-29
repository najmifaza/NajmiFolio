"use client";

import { Button, Column, Heading, Input, Row, Text, Textarea } from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";
import { type SaveStudyInput, saveStudyAction, translateAction } from "../actions";

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
          {study ? "Edit Riwayat Studi" : "Tambah Riwayat Studi Baru"}
        </Heading>

        <Row gap="16" wrap fillWidth>
          <Column gap="8" style={{ flex: 1.5, minWidth: 220 }}>
            <Input
              id="study-institution"
              label="Institusi Pendidikan *"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Universitas Jenderal Soedirman"
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 180 }}>
            <Input
              id="study-timeframe"
              label="Periode Waktu *"
              required
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="2024 - Sekarang"
            />
          </Column>
          <Column gap="8" style={{ flex: 0.5, minWidth: 100 }}>
            <Input
              id="study-order"
              label="Urutan"
              type="number"
              value={String(order)}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </Column>
        </Row>

        {/* Bilingual Content */}
        <Column gap="12" fillWidth>
          <Row vertical="center" horizontal="between">
            <Text variant="label-strong-m" onBackground="neutral-strong">
              Gelar & Deskripsi Pendidikan (Bilingual)
            </Text>
            <Button
              type="button"
              variant="secondary"
              size="s"
              label={translating ? "Menerjemahkan..." : "✨ Auto-Translate ID ke EN"}
              disabled={translating}
              onClick={handleAutoTranslate}
            />
          </Row>

          <Row gap="16" wrap fillWidth>
            <Column
              gap="12"
              padding="16"
              radius="m"
              background="neutral-alpha-weak"
              border="neutral-alpha-weak"
              style={{ flex: 1, minWidth: 280 }}
            >
              <Text variant="label-strong-xs" onBackground="neutral-medium">
                🇮🇩 Bahasa Indonesia
              </Text>
              <Input
                id="study-id-degree"
                label="Gelar / Program Studi *"
                required
                value={idDegree}
                onChange={(e) => setIdDegree(e.target.value)}
                placeholder="S1 Informatika"
              />
              <Textarea
                id="study-id-desc"
                label="Deskripsi / Fokus Akademik"
                value={idDescription}
                onChange={(e) => setIdDescription(e.target.value)}
                placeholder="Fokus pada rekayasa perangkat lunak dan sistem informasi..."
                lines={4}
              />
            </Column>

            <Column
              gap="12"
              padding="16"
              radius="m"
              background="neutral-alpha-weak"
              border="neutral-alpha-weak"
              style={{ flex: 1, minWidth: 280 }}
            >
              <Text variant="label-strong-xs" onBackground="neutral-medium">
                🇬🇧 English
              </Text>
              <Input
                id="study-en-degree"
                label="Degree / Program"
                value={enDegree}
                onChange={(e) => setEnDegree(e.target.value)}
                placeholder="Bachelor of Informatics"
              />
              <Textarea
                id="study-en-desc"
                label="Description / Academic Focus"
                value={enDescription}
                onChange={(e) => setEnDescription(e.target.value)}
                placeholder="Focusing on software engineering and information systems..."
                lines={4}
              />
            </Column>
          </Row>
        </Column>

        <Row horizontal="end" gap="12" paddingTop="16" borderTop="neutral-alpha-weak">
          <Button type="button" variant="secondary" size="m" label="Batal" onClick={onCancel} />
          <Button
            type="submit"
            variant="primary"
            size="m"
            label={saving ? "Menyimpan..." : "Simpan Riwayat Studi"}
            disabled={saving}
            loading={saving}
          />
        </Row>
      </form>
    </Column>
  );
}
