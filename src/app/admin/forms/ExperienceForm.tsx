"use client";

import { Button, Column, Heading, Input, Row, Text, Textarea } from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";
import { type SaveExperienceInput, saveExperienceAction, translateAction } from "../actions";

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
          {experience ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
        </Heading>

        <Row gap="16" wrap fillWidth>
          <Column gap="8" style={{ flex: 1, minWidth: 220 }}>
            <Input
              id="exp-company"
              label="Perusahaan / Organisasi *"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 200 }}>
            <Input
              id="exp-timeframe"
              label="Timeframe (Periode) *"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="Jan 2026 - Present"
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 140 }}>
            <Input
              id="exp-order"
              label="Urutan Tampil (Order)"
              type="number"
              value={String(order)}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
              description="Urutan 1–8: Work. 9+: Organization."
            />
          </Column>
        </Row>

        <Column gap="12" fillWidth>
          <Row vertical="center" horizontal="between">
            <Text variant="label-strong-m" onBackground="neutral-strong">
              Peran & Poin Pencapaian
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
            <Column
              gap="12"
              padding="16"
              radius="m"
              background="neutral-alpha-weak"
              border="neutral-alpha-weak"
              style={{ flex: 1, minWidth: 280 }}
            >
              <Text variant="label-strong-xs" onBackground="neutral-medium">
                🇮🇩 Indonesia
              </Text>
              <Input
                id="exp-id-role"
                label="Role / Jabatan *"
                value={idRole}
                onChange={(e) => setIdRole(e.target.value)}
                required
              />
              <Textarea
                id="exp-id-achievements"
                label="Pencapaian (1 baris per poin)"
                value={idAchievementsStr}
                onChange={(e) => setIdAchievementsStr(e.target.value)}
                placeholder="Mengembangkan sistem XYZ..."
                lines={6}
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
                id="exp-en-role"
                label="Role / Position"
                value={enRole}
                onChange={(e) => setEnRole(e.target.value)}
              />
              <Textarea
                id="exp-en-achievements"
                label="Achievements (1 per line)"
                value={enAchievementsStr}
                onChange={(e) => setEnAchievementsStr(e.target.value)}
                placeholder="Developed XYZ system..."
                lines={6}
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
            label={saving ? "Menyimpan..." : "Simpan Pengalaman"}
            disabled={saving}
            loading={saving}
          />
        </Row>
      </form>
    </Column>
  );
}
