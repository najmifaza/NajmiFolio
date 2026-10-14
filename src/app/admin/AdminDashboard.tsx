"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.scss";
import {
  saveProjectAction,
  deleteProjectAction,
  saveProfileAction,
  saveExperienceAction,
  deleteExperienceAction,
  saveCertificateAction,
  deleteCertificateAction,
  uploadMediaAction,
  translateAction,
  SaveProjectInput,
  SaveProfileInput,
  SaveExperienceInput,
  SaveCertificateInput,
} from "./actions";

interface AdminDashboardProps {
  initialProjects: any[];
  initialProfile: any;
  initialExperiences: any[];
  initialCertificates: any[];
}

export default function AdminDashboard({
  initialProjects,
  initialProfile,
  initialExperiences,
  initialCertificates,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "projects" | "profile" | "experiences" | "certificates"
  >("projects");

  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [profile, setProfile] = useState<any>(initialProfile);

  const [experiences, setExperiences] = useState<any[]>(initialExperiences);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);
  const [isCreatingExperience, setIsCreatingExperience] = useState(false);

  const [certificates, setCertificates] = useState<any[]>(initialCertificates);
  const [editingCertificate, setEditingCertificate] = useState<any | null>(null);
  const [isCreatingCertificate, setIsCreatingCertificate] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    await fetch("/api/authenticate", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>NF</div>
            <div className={styles.brandText}>
              <span>Najmi CMS</span>
              <span>
                <span className={styles.statusDot}></span>
                MySQL Live
              </span>
            </div>
          </div>

          <nav className={styles.navGroup}>
            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "projects" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("projects");
                setIsCreatingProject(false);
                setEditingProject(null);
              }}
            >
              <div className={styles.navItemLeft}>
                <span>📁</span>
                <span>Projects</span>
              </div>
              <span className={styles.navBadge}>{projects.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <div className={styles.navItemLeft}>
                <span>👤</span>
                <span>Profile & Bio</span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "experiences" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("experiences");
                setIsCreatingExperience(false);
                setEditingExperience(null);
              }}
            >
              <div className={styles.navItemLeft}>
                <span>💼</span>
                <span>Experiences</span>
              </div>
              <span className={styles.navBadge}>{experiences.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "certificates" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("certificates");
                setIsCreatingCertificate(false);
                setEditingCertificate(null);
              }}
            >
              <div className={styles.navItemLeft}>
                <span>🏆</span>
                <span>Certificates</span>
              </div>
              <span className={styles.navBadge}>{certificates.length}</span>
            </button>
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navItem}
            style={{ textDecoration: "none" }}
          >
            <div className={styles.navItemLeft}>
              <span>🌐</span>
              <span>Lihat Website</span>
            </div>
            <span>↗</span>
          </a>
          <button
            type="button"
            className={styles.navItem}
            style={{ color: "#f87171" }}
            onClick={handleLogout}
          >
            <div className={styles.navItemLeft}>
              <span>🚪</span>
              <span>Keluar</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* TAB 1: PROJECTS */}
        {activeTab === "projects" && (
          <div>
            <div className={styles.contentHeader}>
              <div className={styles.pageTitleGroup}>
                <h1>Projects Manager</h1>
                <p>Kelola portofolio karya, media cover CDN, dan terjemahan otomatis.</p>
              </div>
              {!isCreatingProject && !editingProject && (
                <button
                  type="button"
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "13.5px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  }}
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreatingProject(true);
                  }}
                >
                  + Tambah Project Baru
                </button>
              )}
            </div>

            {(isCreatingProject || editingProject) ? (
              <ProjectForm
                project={editingProject}
                onCancel={() => {
                  setIsCreatingProject(false);
                  setEditingProject(null);
                }}
                onSave={(savedProject) => {
                  setIsCreatingProject(false);
                  setEditingProject(null);
                  showToast("success", `Project "${savedProject.slug}" berhasil disimpan!`);
                  router.refresh();
                }}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {projects.map((proj) => {
                  const idTrans = proj.translations?.find((t: any) => t.locale === "id") || {};
                  const enTrans = proj.translations?.find((t: any) => t.locale === "en") || {};
                  const coverImg = Array.isArray(proj.images) ? proj.images[0] : "";

                  return (
                    <div key={proj.id} className={styles.itemCard}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={proj.slug}
                            style={{
                              width: 80,
                              height: 52,
                              objectFit: "cover",
                              borderRadius: 6,
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 80,
                              height: 52,
                              borderRadius: 6,
                              background: "rgba(255,255,255,0.05)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "rgba(255,255,255,0.2)",
                              fontSize: 12,
                              flexShrink: 0,
                            }}
                          >
                            No Media
                          </div>
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                              {idTrans.title || proj.slug}
                            </span>
                            {proj.featured && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  background: "rgba(59, 130, 246, 0.2)",
                                  color: "#93c5fd",
                                  fontWeight: 600,
                                }}
                              >
                                Featured
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)" }}>
                            <code>/{proj.slug}</code> {enTrans.title && `• EN: ${enTrans.title}`}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <button
                          type="button"
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.05)",
                            color: "#fff",
                            fontSize: "12.5px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setIsCreatingProject(false);
                            setEditingProject(proj);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            background: "rgba(239, 68, 68, 0.08)",
                            color: "#f87171",
                            fontSize: "12.5px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            if (confirm(`Yakin hapus project ${proj.slug}?`)) {
                              await deleteProjectAction(proj.id);
                              setProjects(projects.filter((p) => p.id !== proj.id));
                              showToast("success", "Project berhasil dihapus");
                              router.refresh();
                            }
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === "profile" && (
          <div>
            <div className={styles.contentHeader}>
              <div className={styles.pageTitleGroup}>
                <h1>Profile & Personal Bio</h1>
                <p>Ubah avatar, informasi diri, kontak, dan narasi biografi dwibahasa.</p>
              </div>
            </div>

            <ProfileForm
              profile={profile}
              onSave={() => {
                showToast("success", "Profil & Bio berhasil diperbarui!");
                router.refresh();
              }}
            />
          </div>
        )}

        {/* TAB 3: EXPERIENCES */}
        {activeTab === "experiences" && (
          <div>
            <div className={styles.contentHeader}>
              <div className={styles.pageTitleGroup}>
                <h1>Work & Organization Experiences</h1>
                <p>Kelola riwayat karir, kepanitiaan, dan pencapaian profesional.</p>
              </div>
              {!isCreatingExperience && !editingExperience && (
                <button
                  type="button"
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "13.5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setEditingExperience(null);
                    setIsCreatingExperience(true);
                  }}
                >
                  + Tambah Pengalaman
                </button>
              )}
            </div>

            {(isCreatingExperience || editingExperience) ? (
              <ExperienceForm
                experience={editingExperience}
                onCancel={() => {
                  setIsCreatingExperience(false);
                  setEditingExperience(null);
                }}
                onSave={() => {
                  setIsCreatingExperience(false);
                  setEditingExperience(null);
                  showToast("success", "Pengalaman berhasil disimpan!");
                  router.refresh();
                }}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {experiences.map((exp: any) => {
                  const idTrans = exp.translations?.find((t: any) => t.locale === "id") || {};
                  return (
                    <div key={exp.id} className={styles.itemCard}>
                      <div>
                        <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                          {exp.company}
                        </div>
                        <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                          {idTrans.role} • {exp.timeframe} (Urutan: {exp.order})
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.05)",
                            color: "#fff",
                            fontSize: "12.5px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setIsCreatingExperience(false);
                            setEditingExperience(exp);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            background: "rgba(239, 68, 68, 0.08)",
                            color: "#f87171",
                            fontSize: "12.5px",
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            if (confirm(`Hapus pengalaman ${exp.company}?`)) {
                              await deleteExperienceAction(exp.id);
                              setExperiences(experiences.filter((e: any) => e.id !== exp.id));
                              showToast("success", "Pengalaman berhasil dihapus");
                              router.refresh();
                            }
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CERTIFICATES */}
        {activeTab === "certificates" && (
          <div>
            <div className={styles.contentHeader}>
              <div className={styles.pageTitleGroup}>
                <h1>Certificates & Licenses</h1>
                <p>Kelola sertifikasi keahlian dan bukti badge kredensial.</p>
              </div>
              {!isCreatingCertificate && !editingCertificate && (
                <button
                  type="button"
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "13.5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setEditingCertificate(null);
                    setIsCreatingCertificate(true);
                  }}
                >
                  + Tambah Sertifikat
                </button>
              )}
            </div>

            {(isCreatingCertificate || editingCertificate) ? (
              <CertificateForm
                cert={editingCertificate}
                onCancel={() => {
                  setIsCreatingCertificate(false);
                  setEditingCertificate(null);
                }}
                onSave={() => {
                  setIsCreatingCertificate(false);
                  setEditingCertificate(null);
                  showToast("success", "Sertifikat berhasil disimpan!");
                  router.refresh();
                }}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {certificates.map((cert: any) => (
                  <div key={cert.id} className={styles.itemCard}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {cert.image && (
                        <img
                          src={cert.image}
                          alt={cert.title}
                          style={{
                            width: 60,
                            height: 42,
                            objectFit: "contain",
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 6,
                            padding: 2,
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                          {cert.title}
                        </div>
                        <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                          {cert.issuer} • {cert.date}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        style={{
                          padding: "6px 14px",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.05)",
                          color: "#fff",
                          fontSize: "12.5px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setIsCreatingCertificate(false);
                          setEditingCertificate(cert);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          background: "rgba(239, 68, 68, 0.08)",
                          color: "#f87171",
                          fontSize: "12.5px",
                          cursor: "pointer",
                        }}
                        onClick={async () => {
                          if (confirm(`Hapus sertifikat ${cert.title}?`)) {
                            await deleteCertificateAction(cert.id);
                            setCertificates(certificates.filter((c: any) => c.id !== cert.id));
                            showToast("success", "Sertifikat dihapus");
                            router.refresh();
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// FORM 1: PROJECT FORM
// ==========================================
function ProjectForm({
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
  const [link, setLink] = useState(project?.link || "");
  const [github, setGithub] = useState(project?.github || "");
  const [featured, setFeatured] = useState(project?.featured || false);
  const [images, setImages] = useState<string[]>(Array.isArray(project?.images) ? project.images : []);

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
      alert("Upload gagal: " + (res.error || "Unknown error"));
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
      alert("Gagal translate: " + err.message);
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
      alert("Gagal menyimpan project: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.glassCard}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
          <label htmlFor="proj-featured" style={{ cursor: "pointer", fontSize: 13.5, color: "rgba(255,255,255,0.8)" }}>
            Jadikan Featured Project (tampil di badge teratas Halaman Utama)
          </label>
        </div>

        {/* Media Upload Area */}
        <div className={styles.formGroup}>
          <label>Cover & Media Galeri (CDN assets.najmifaza.my.id)</label>
          <label className={styles.uploadZone}>
            <span style={{ fontSize: 24 }}>☁️</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#93c5fd" }}>
              {uploading ? "Sedang Mengunggah File ke CDN..." : "Klik untuk Upload Media Baru"}
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
                <div key={idx} className={styles.mediaThumbItem}>
                  {url.endsWith(".webm") ? (
                    <video src={url} muted autoPlay loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
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
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18 }}>
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
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// FORM 2: PROFILE FORM
// ==========================================
function ProfileForm({ profile, onSave }: { profile: any; onSave: () => void }) {
  const idTrans = profile?.translations?.find((t: any) => t.locale === "id") || {};
  const enTrans = profile?.translations?.find((t: any) => t.locale === "en") || {};

  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [location, setLocation] = useState(profile?.location || "Asia/Jakarta");
  const [languagesStr, setLanguagesStr] = useState(
    Array.isArray(profile?.languages) ? profile.languages.join(", ") : "English, Indonesian, Arabic"
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
      alert("Upload avatar gagal: " + (res.error || "Unknown error"));
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
        languages: languagesStr.split(",").map((s: string) => s.trim()).filter(Boolean),
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
      onSave();
    } catch (err: any) {
      alert("Gagal menyimpan profil: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.glassCard}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
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

        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// FORM 3: EXPERIENCE FORM
// ==========================================
function ExperienceForm({ experience, onCancel, onSave }: any) {
  const idTrans = experience?.translations?.find((t: any) => t.locale === "id") || {};
  const enTrans = experience?.translations?.find((t: any) => t.locale === "en") || {};

  const [company, setCompany] = useState(experience?.company || "");
  const [timeframe, setTimeframe] = useState(experience?.timeframe || "");
  const [order, setOrder] = useState(experience?.order ?? 1);

  const [idRole, setIdRole] = useState(idTrans.role || "");
  const [idAchievementsStr, setIdAchievementsStr] = useState(
    Array.isArray(idTrans.achievements) ? idTrans.achievements.join("\n") : ""
  );

  const [enRole, setEnRole] = useState(enTrans.role || "");
  const [enAchievementsStr, setEnAchievementsStr] = useState(
    Array.isArray(enTrans.achievements) ? enTrans.achievements.join("\n") : ""
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
          lines.map(async (line: string) => (await translateAction(line, "id", "en")).result)
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
      alert("Gagal simpan pengalaman: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.glassCard}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "#fff" }}>
          {experience ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
        </h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Perusahaan / Organisasi *</label>
            <input
              className={styles.formInput}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Timeframe (Periode) *</label>
            <input
              className={styles.formInput}
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="Jan 2026 - Present"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Urutan Tampil (Order)</label>
            <input
              className={styles.formInput}
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
              Peran & Poin Pencapaian
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
            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>🇮🇩 Indonesia</div>
              <div className={styles.formGroup}>
                <label>Role / Jabatan *</label>
                <input
                  className={styles.formInput}
                  value={idRole}
                  onChange={(e) => setIdRole(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Pencapaian (1 baris per poin)</label>
                <textarea
                  className={styles.formTextarea}
                  value={idAchievementsStr}
                  onChange={(e) => setIdAchievementsStr(e.target.value)}
                  placeholder="Mengembangkan sistem XYZ..."
                />
              </div>
            </div>

            <div className={styles.bilingualColumn}>
              <div className={styles.langPill}>🇬🇧 English</div>
              <div className={styles.formGroup}>
                <label>Role / Position</label>
                <input
                  className={styles.formInput}
                  value={enRole}
                  onChange={(e) => setEnRole(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Achievements (1 per line)</label>
                <textarea
                  className={styles.formTextarea}
                  value={enAchievementsStr}
                  onChange={(e) => setEnAchievementsStr(e.target.value)}
                  placeholder="Developed XYZ system..."
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18 }}>
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
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Pengalaman"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// FORM 4: CERTIFICATE FORM
// ==========================================
function CertificateForm({ cert, onCancel, onSave }: any) {
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
      alert("Upload sertifikat gagal: " + (res.error || "Unknown error"));
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
      alert("Gagal simpan sertifikat: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.glassCard}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18 }}>
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
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Sertifikat"}
          </button>
        </div>
      </form>
    </div>
  );
}
