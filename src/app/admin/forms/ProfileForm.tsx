"use client";

import { UniversalIcon } from "@/resources/icons";
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
import styles from "../admin.module.scss";

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
    <div className={styles.glassCard}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {/* Avatar & Identitas */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          {avatar && (
            <img
              src={avatar}
              alt="Avatar"
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(59, 130, 246, 0.4)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              }}
            />
          )}
          <label
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
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
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Email Kontak</label>
            <input
              className={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Timezone / Lokasi</label>
            <input
              className={styles.formInput}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Languages (Pisahkan koma)</label>
            <input
              className={styles.formInput}
              value={languagesStr}
              onChange={(e) => setLanguagesStr(e.target.value)}
            />
          </div>
        </div>

        {/* Bilingual Narrative */}
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
              Narasi & Informasi Pribadi
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
                <span>🇮🇩</span> Indonesia
              </div>
              <div className={styles.formGroup}>
                <label>Nama Tampilan *</label>
                <input
                  className={styles.formInput}
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Role / Profesi *</label>
                <input
                  className={styles.formInput}
                  value={idRole}
                  onChange={(e) => setIdRole(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Headline (Home)</label>
                <input
                  className={styles.formInput}
                  value={idHeadline}
                  onChange={(e) => setIdHeadline(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Subline (Home Hero)</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 70 }}
                  value={idSubline}
                  onChange={(e) => setIdSubline(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Intro / Biografi (About Page)</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 120 }}
                  value={idIntro}
                  onChange={(e) => setIdIntro(e.target.value)}
                />
              </div>
            </div>

            {/* EN */}
            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>
                <span>🇬🇧</span> English
              </div>
              <div className={styles.formGroup}>
                <label>Display Name</label>
                <input
                  className={styles.formInput}
                  value={enName}
                  onChange={(e) => setEnName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Role / Job Title</label>
                <input
                  className={styles.formInput}
                  value={enRole}
                  onChange={(e) => setEnRole(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Headline (Home)</label>
                <input
                  className={styles.formInput}
                  value={enHeadline}
                  onChange={(e) => setEnHeadline(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Subline (Home Hero)</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 70 }}
                  value={enSubline}
                  onChange={(e) => setEnSubline(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Intro / Biography (About Page)</label>
                <textarea
                  className={styles.formTextarea}
                  style={{ minHeight: 120 }}
                  value={enIntro}
                  onChange={(e) => setEnIntro(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                Social Media Links
              </div>
              <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                Dikelola dinamis dan tampil di header, bio profil, serta footer. •{" "}
                <a
                  href="https://icon-sets.iconify.design/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#34d399", textDecoration: "underline" }}
                >
                  Katalog 200.000+ Iconify ↗
                </a>
              </div>
            </div>
            <button
              type="button"
              className={styles.secondaryButton}
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
            >
              + Tambah Social Link
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {socialLinks.map((item, idx) => (
              <div
                key={item.id || `${item.name}-${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.2fr 2fr 90px 45px",
                  gap: "10px",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      marginBottom: 3,
                    }}
                  >
                    Platform
                  </label>
                  <input
                    className={styles.formInput}
                    value={item.name}
                    placeholder="GitHub"
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].name = e.target.value;
                      setSocialLinks(updated);
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      marginBottom: 3,
                    }}
                  >
                    Icon
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <UniversalIcon name={item.icon || "globe"} size={18} color="#34d399" />
                    </div>
                    <input
                      className={styles.formInput}
                      list={`icon-suggestions-${idx}`}
                      value={item.icon || ""}
                      placeholder="Pilih atau ketik icon..."
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
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      marginBottom: 3,
                    }}
                  >
                    Target URL
                  </label>
                  <input
                    className={styles.formInput}
                    value={item.link}
                    placeholder="https://..."
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].link = e.target.value;
                      setSocialLinks(updated);
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      marginBottom: 3,
                    }}
                  >
                    Essential
                  </label>
                  <div style={{ display: "flex", alignItems: "center", height: 38 }}>
                    <input
                      type="checkbox"
                      checked={item.essential}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[idx].essential = e.target.checked;
                        setSocialLinks(updated);
                      }}
                      style={{ width: 18, height: 18, accentColor: "#10b981", cursor: "pointer" }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "transparent",
                      display: "block",
                      marginBottom: 3,
                    }}
                  >
                    X
                  </label>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    style={{ padding: "8px 10px", width: "100%" }}
                    onClick={() => {
                      setSocialLinks(socialLinks.filter((_, i) => i !== idx));
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 18,
          }}
        >
          <button type="submit" disabled={saving} className={styles.primaryButton}>
            {saving ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
