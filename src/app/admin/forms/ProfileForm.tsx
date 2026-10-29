"use client";

import { UniversalIcon } from "@/resources/icons";
import {
  Button,
  Checkbox,
  Column,
  Heading,
  Input,
  Row,
  SmartLink,
  Switch,
  Text,
  Textarea,
} from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";
import {
  type SaveProfileInput,
  type SocialLinkItem,
  saveProfileAction,
  saveSocialLinksAction,
  translateAction,
  uploadMediaAction,
} from "../actions";

const SOCIAL_ICON_OPTIONS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
  { value: "x", label: "X (Twitter)" },
  { value: "twitter", label: "Twitter" },
  { value: "threads", label: "Threads" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
  { value: "globe", label: "Website / Globe" },
  { value: "document", label: "Document / Resume" },
  { value: "rocket", label: "Product / Rocket" },
  { value: "openLink", label: "External Link" },
];

export default function ProfileForm({ profile, onSave }: { profile: any; onSave: () => void }) {
  const idTrans = profile?.translations?.find((t: any) => t.locale === "id") || {};
  const enTrans = profile?.translations?.find((t: any) => t.locale === "en") || {};

  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [location, setLocation] = useState(profile?.location || "Asia/Jakarta");
  const [languagesStr, setLanguagesStr] = useState(
    Array.isArray(profile?.languages)
      ? profile.languages.join(", ")
      : "English, Indonesian, Arabic",
  );

  const [idName, setIdName] = useState(idTrans.name || "");
  const [idRole, setIdRole] = useState(idTrans.role || "");
  const [idHeadline, setIdHeadline] = useState(idTrans.headline || "");
  const [idSubline, setIdSubline] = useState(idTrans.subline || "");
  const [idIntro, setIdIntro] = useState(idTrans.intro || "");

  const [enName, setEnName] = useState(enTrans.name || "");
  const [enRole, setEnRole] = useState(enTrans.role || "");
  const [enHeadline, setEnHeadline] = useState(enTrans.headline || "");
  const [enSubline, setEnSubline] = useState(enTrans.subline || "");
  const [enIntro, setEnIntro] = useState(enTrans.intro || "");

  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(
    profile?.socialLinks?.length > 0
      ? profile.socialLinks
      : [
          {
            name: "GitHub",
            icon: "github",
            link: "https://github.com/najmifaza",
            essential: true,
            order: 1,
          },
          {
            name: "LinkedIn",
            icon: "linkedin",
            link: "https://www.linkedin.com/in/adridinan-najmi-faza-80b88a301",
            essential: true,
            order: 2,
          },
          {
            name: "Instagram",
            icon: "instagram",
            link: "https://www.instagram.com/najmi.zaa/",
            essential: true,
            order: 3,
          },
          {
            name: "Email",
            icon: "email",
            link: "mailto:adridinan99@gmail.com",
            essential: true,
            order: 4,
          },
        ],
  );

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadMediaAction(formData);
    if (res.success && res.url) {
      setAvatar(res.url);
    } else {
      alert(`Upload avatar gagal: ${res.error || "Unknown error"}`);
    }
    setUploadingAvatar(false);
  };

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      if (idRole) setEnRole((await translateAction(idRole, "id", "en")).result);
      if (idHeadline) setEnHeadline((await translateAction(idHeadline, "id", "en")).result);
      if (idSubline) setEnSubline((await translateAction(idSubline, "id", "en")).result);
      if (idIntro) setEnIntro((await translateAction(idIntro, "id", "en")).result);
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: SaveProfileInput = {
        avatar,
        email,
        location,
        languages: languagesStr
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        idName,
        idRole,
        idHeadline,
        idSubline,
        idIntro,
        enName: enName || idName,
        enRole: enRole || idRole,
        enHeadline,
        enSubline,
        enIntro,
      };

      await saveProfileAction(payload);
      await saveSocialLinksAction(socialLinks);
      onSave();
    } catch (err: any) {
      alert(`Gagal menyimpan profil: ${err.message}`);
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
          Profil & Identitas Utama
        </Heading>

        {/* Avatar & Identitas */}
        <Row vertical="center" gap="20" wrap>
          {avatar && (
            <img
              src={avatar}
              alt="Avatar"
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--border-neutral-alpha-medium)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              }}
            />
          )}
          <label
            style={{
              padding: "9px 16px",
              borderRadius: "var(--radius-m)",
              background: "var(--neutral-alpha-weak)",
              border: "1px solid var(--border-neutral-alpha-medium)",
              color: "var(--neutral-on-background-strong)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {uploadingAvatar ? "Mengunggah..." : "📷 Ganti Foto Avatar (CDN)"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
          </label>
        </Row>

        <Row gap="16" wrap fillWidth>
          <Column gap="8" style={{ flex: 1, minWidth: 200 }}>
            <Input
              id="prof-email"
              label="Email Kontak"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1, minWidth: 200 }}>
            <Input
              id="prof-location"
              label="Timezone / Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Column>
          <Column gap="8" style={{ flex: 1.5, minWidth: 240 }}>
            <Input
              id="prof-languages"
              label="Languages (Pisahkan koma)"
              value={languagesStr}
              onChange={(e) => setLanguagesStr(e.target.value)}
            />
          </Column>
        </Row>

        {/* Bilingual Narrative */}
        <Column gap="12" fillWidth>
          <Row vertical="center" horizontal="between">
            <Text variant="label-strong-m" onBackground="neutral-strong">
              Narasi & Informasi Pribadi
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
                🇮🇩 Indonesia
              </Text>
              <Input
                id="prof-id-name"
                label="Nama Tampilan *"
                value={idName}
                onChange={(e) => setIdName(e.target.value)}
                required
              />
              <Input
                id="prof-id-role"
                label="Role / Profesi *"
                value={idRole}
                onChange={(e) => setIdRole(e.target.value)}
                required
              />
              <Input
                id="prof-id-headline"
                label="Headline (Home)"
                value={idHeadline}
                onChange={(e) => setIdHeadline(e.target.value)}
              />
              <Textarea
                id="prof-id-subline"
                label="Subline (Home Hero)"
                value={idSubline}
                onChange={(e) => setIdSubline(e.target.value)}
                lines={3}
              />
              <Textarea
                id="prof-id-intro"
                label="Intro / Biografi (About Page)"
                value={idIntro}
                onChange={(e) => setIdIntro(e.target.value)}
                lines={5}
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
                🇬🇧 English
              </Text>
              <Input
                id="prof-en-name"
                label="Display Name"
                value={enName}
                onChange={(e) => setEnName(e.target.value)}
              />
              <Input
                id="prof-en-role"
                label="Role / Job Title"
                value={enRole}
                onChange={(e) => setEnRole(e.target.value)}
              />
              <Input
                id="prof-en-headline"
                label="Headline (Home)"
                value={enHeadline}
                onChange={(e) => setEnHeadline(e.target.value)}
              />
              <Textarea
                id="prof-en-subline"
                label="Subline (Home Hero)"
                value={enSubline}
                onChange={(e) => setEnSubline(e.target.value)}
                lines={3}
              />
              <Textarea
                id="prof-en-intro"
                label="Intro / Biography (About Page)"
                value={enIntro}
                onChange={(e) => setEnIntro(e.target.value)}
                lines={5}
              />
            </Column>
          </Row>
        </Column>

        {/* Social Media Links */}
        <Column gap="16" fillWidth paddingTop="16" borderTop="neutral-alpha-weak">
          <Row vertical="center" horizontal="between" wrap gap="12">
            <Column gap="2">
              <Text variant="label-strong-m" onBackground="neutral-strong">
                Social Media Links
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Dikelola dinamis dan tampil di header, bio profil, serta footer. •{" "}
                <SmartLink
                  href="https://icon-sets.iconify.design/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Text as="span" onBackground="brand-medium">
                    Katalog 200.000+ Iconify ↗
                  </Text>
                </SmartLink>
              </Text>
            </Column>
            <Button
              type="button"
              variant="secondary"
              size="s"
              label="+ Tambah Social Link"
              onClick={() => {
                setSocialLinks([
                  ...socialLinks,
                  {
                    name: "Platform",
                    icon: "globe",
                    link: "https://",
                    essential: true,
                    order: socialLinks.length + 1,
                  },
                ]);
              }}
            />
          </Row>

          <Column gap="12" fillWidth>
            {socialLinks.map((item, idx) => (
              <Row
                key={item.id || `${item.name}-${idx}`}
                gap="12"
                vertical="center"
                padding="12"
                radius="m"
                background="neutral-alpha-weak"
                border="neutral-alpha-weak"
                wrap
              >
                <Column style={{ flex: "1 1 120px" }}>
                  <Input
                    id={`soc-name-${idx}`}
                    label="Platform"
                    value={item.name}
                    placeholder="GitHub"
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].name = e.target.value;
                      setSocialLinks(updated);
                    }}
                  />
                </Column>
                <Row gap="8" vertical="end" style={{ flex: "1.5 1 180px" }}>
                  <Row
                    center
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-m)",
                      background: "var(--surface-background)",
                      border: "1px solid var(--border-neutral-alpha-medium)",
                      flexShrink: 0,
                    }}
                  >
                    <UniversalIcon
                      name={item.icon || "globe"}
                      size={18}
                      color="var(--brand-solid-strong)"
                    />
                  </Row>
                  <Column style={{ flex: 1 }}>
                    <Input
                      id={`soc-icon-${idx}`}
                      label="Icon"
                      list={`icon-suggestions-${idx}`}
                      value={item.icon || ""}
                      placeholder="Iconify ID..."
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[idx].icon = e.target.value;
                        setSocialLinks(updated);
                      }}
                    />
                    <datalist id={`icon-suggestions-${idx}`}>
                      {SOCIAL_ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </datalist>
                  </Column>
                </Row>
                <Column style={{ flex: "2 1 200px" }}>
                  <Input
                    id={`soc-link-${idx}`}
                    label="Target URL"
                    value={item.link}
                    placeholder="https://..."
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].link = e.target.value;
                      setSocialLinks(updated);
                    }}
                  />
                </Column>
                <Column gap="4" horizontal="center" vertical="end">
                  <Checkbox
                    id={`soc-essential-${idx}`}
                    label="Essential"
                    isChecked={item.essential}
                    onToggle={() => {
                      const updated = [...socialLinks];
                      updated[idx].essential = !updated[idx].essential;
                      setSocialLinks(updated);
                    }}
                  />
                </Column>
                <Row vertical="end">
                  <Button
                    type="button"
                    variant="danger"
                    size="s"
                    label="✕"
                    onClick={() => {
                      setSocialLinks(socialLinks.filter((_, i) => i !== idx));
                    }}
                  />
                </Row>
              </Row>
            ))}
          </Column>
        </Column>

        <Row horizontal="end" paddingTop="16" borderTop="neutral-alpha-weak">
          <Button
            type="submit"
            variant="primary"
            size="m"
            label={saving ? "Menyimpan..." : "Simpan Profil"}
            disabled={saving}
            loading={saving}
          />
        </Row>
      </form>
    </Column>
  );
}
