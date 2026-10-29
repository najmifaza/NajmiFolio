"use client";

import { UniversalIcon, resolveIconifyName } from "@/resources/icons";
import {
  Button,
  Column,
  Heading,
  Input,
  Row,
  SmartLink,
  Tag,
  Text,
  Textarea,
} from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";
import { type SaveSkillGroupInput, saveSkillGroupAction, translateAction } from "../actions";

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
          {skillGroup ? "Edit Kelompok Skill" : "Tambah Kelompok Skill Baru"}
        </Heading>

        <Row gap="16" wrap fillWidth>
          <Column gap="8" style={{ flex: 2, minWidth: 240 }}>
            <Input
              id="skill-title"
              label="Identifier Nama Grup (Internal/Default) *"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Web Development"
            />
          </Column>
          <Column gap="8" style={{ flex: 0.5, minWidth: 100 }}>
            <Input
              id="skill-order"
              label="Urutan"
              type="number"
              value={String(order)}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </Column>
        </Row>

        <Column gap="8" fillWidth>
          <Input
            id="skill-list"
            label="Daftar Skills / Teknologi (Pisahkan dengan koma) *"
            required
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="React, Next.js, TypeScript, Node.js, Prisma, MySQL"
          />
          <Row gap="8" wrap paddingTop="4">
            {skillsStr
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
              .map((name: string) => (
                <Row
                  key={name}
                  vertical="center"
                  gap="8"
                  paddingX="8"
                  paddingY="4"
                  radius="m"
                  background="neutral-alpha-weak"
                  border="neutral-alpha-weak"
                >
                  <UniversalIcon
                    name={resolveIconifyName(name)}
                    size={13}
                    color="var(--brand-solid-strong)"
                  />
                  <Text variant="label-default-xs" onBackground="neutral-strong">
                    {name}
                  </Text>
                </Row>
              ))}
          </Row>
          <Text variant="label-default-xs" onBackground="neutral-weak">
            Ketik nama teknologi, icon otomatis terdeteksi (Next.js, Python, Figma, SQL, dll).
          </Text>

          {/* Doc helper box */}
          <Column
            gap="8"
            padding="16"
            radius="m"
            background="neutral-alpha-weak"
            border="neutral-alpha-weak"
            style={{ marginTop: 8 }}
          >
            <Row vertical="center" horizontal="between" wrap gap="8">
              <Text variant="label-strong-xs" onBackground="neutral-strong">
                📖 Pencarian 200.000+ Icon (Iconify):
              </Text>
              <Row gap="12">
                <SmartLink
                  href="https://icon-sets.iconify.design/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Text variant="label-strong-xs" onBackground="brand-medium">
                    Iconify Search Engine ↗
                  </Text>
                </SmartLink>
                <SmartLink href="https://simpleicons.org/" target="_blank" rel="noreferrer">
                  <Text variant="label-strong-xs" onBackground="brand-medium">
                    Simple Icons ↗
                  </Text>
                </SmartLink>
              </Row>
            </Row>
            <Text
              variant="body-default-xs"
              onBackground="neutral-medium"
              style={{ lineHeight: 1.5 }}
            >
              Ketik nama teknologi biasa atau format spesifik seperti{" "}
              <code>simple-icons:docker</code>, <code>lucide:cpu</code>, dll.
            </Text>
          </Column>
        </Column>

        {/* Bilingual Content */}
        <Column gap="12" fillWidth>
          <Row vertical="center" horizontal="between">
            <Text variant="label-strong-m" onBackground="neutral-strong">
              Judul & Penjelasan Grup Skill (Bilingual)
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
                id="skill-id-title"
                label="Judul Kelompok *"
                required
                value={idTitle}
                onChange={(e) => setIdTitle(e.target.value)}
                placeholder="Pengembangan Web"
              />
              <Textarea
                id="skill-id-desc"
                label="Deskripsi Tambahan"
                value={idDescription}
                onChange={(e) => setIdDescription(e.target.value)}
                placeholder="Keahlian dalam membangun aplikasi web modern performa tinggi..."
                lines={3}
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
                id="skill-en-title"
                label="Group Title"
                value={enTitle}
                onChange={(e) => setEnTitle(e.target.value)}
                placeholder="Web Development"
              />
              <Textarea
                id="skill-en-desc"
                label="Description"
                value={enDescription}
                onChange={(e) => setEnDescription(e.target.value)}
                placeholder="Proficiency in building high-performance modern web apps..."
                lines={3}
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
            label={saving ? "Menyimpan..." : "Simpan Kelompok Skill"}
            disabled={saving}
            loading={saving}
          />
        </Row>
      </form>
    </Column>
  );
}
