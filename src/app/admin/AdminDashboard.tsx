"use client";

import { UniversalIcon, resolveIconifyName } from "@/resources/icons";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import {
  deleteAnonymousMessageAction,
  deleteCertificateAction,
  deleteExperienceAction,
  deleteMessageRoomAction,
  deleteProjectAction,
  deleteSkillGroupAction,
  deleteStudyAction,
  moveOrderAction,
} from "./actions";
import styles from "./admin.module.scss";
import CertificateForm from "./forms/CertificateForm";
import ExperienceForm from "./forms/ExperienceForm";
import ProfileForm from "./forms/ProfileForm";
import ProjectForm from "./forms/ProjectForm";
import RoomForm from "./forms/RoomForm";
import SkillGroupForm from "./forms/SkillGroupForm";
import StudyForm from "./forms/StudyForm";

const OrderButtons = ({
  order,
  isFirst,
  isLast,
  onUp,
  onDown,
  disabled,
}: {
  order: number;
  isFirst: boolean;
  isLast: boolean;
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3px",
        paddingRight: "10px",
        marginRight: "6px",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        disabled={isFirst || disabled}
        onClick={(e) => {
          e.stopPropagation();
          onUp();
        }}
        title="Geser ke Atas"
        style={{
          width: "26px",
          height: "20px",
          borderRadius: "4px",
          background:
            isFirst || disabled ? "rgba(255, 255, 255, 0.02)" : "rgba(16, 185, 129, 0.12)",
          border:
            isFirst || disabled
              ? "1px solid rgba(255, 255, 255, 0.05)"
              : "1px solid rgba(16, 185, 129, 0.3)",
          color: isFirst || disabled ? "rgba(255, 255, 255, 0.2)" : "#10b981",
          cursor: isFirst || disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          lineHeight: 1,
          transition: "all 0.15s ease",
        }}
      >
        ▲
      </button>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "rgba(255, 255, 255, 0.8)",
          minWidth: "22px",
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        #{order}
      </span>
      <button
        type="button"
        disabled={isLast || disabled}
        onClick={(e) => {
          e.stopPropagation();
          onDown();
        }}
        title="Geser ke Bawah"
        style={{
          width: "26px",
          height: "20px",
          borderRadius: "4px",
          background: isLast || disabled ? "rgba(255, 255, 255, 0.02)" : "rgba(16, 185, 129, 0.12)",
          border:
            isLast || disabled
              ? "1px solid rgba(255, 255, 255, 0.05)"
              : "1px solid rgba(16, 185, 129, 0.3)",
          color: isLast || disabled ? "rgba(255, 255, 255, 0.2)" : "#10b981",
          cursor: isLast || disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          lineHeight: 1,
          transition: "all 0.15s ease",
        }}
      >
        ▼
      </button>
    </div>
  );
};

interface AdminDashboardProps {
  initialProjects: any[];
  initialProfile: any;
  initialExperiences: any[];
  initialCertificates: any[];
  initialStudies?: any[];
  initialSkills?: any[];
  initialRooms?: any[];
}

export default function AdminDashboard({
  initialProjects,
  initialProfile,
  initialExperiences,
  initialCertificates,
  initialStudies = [],
  initialSkills = [],
  initialRooms = [],
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "projects" | "profile" | "experiences" | "studies" | "skills" | "certificates" | "rooms"
  >("projects");

  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [profile, setProfile] = useState<any>(initialProfile);

  const [experiences, setExperiences] = useState<any[]>(initialExperiences);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);
  const [isCreatingExperience, setIsCreatingExperience] = useState(false);

  const [studies, setStudies] = useState<any[]>(initialStudies);
  const [editingStudy, setEditingStudy] = useState<any | null>(null);
  const [isCreatingStudy, setIsCreatingStudy] = useState(false);

  const [skills, setSkills] = useState<any[]>(initialSkills);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);

  const [certificates, setCertificates] = useState<any[]>(initialCertificates);
  const [editingCertificate, setEditingCertificate] = useState<any | null>(null);
  const [isCreatingCertificate, setIsCreatingCertificate] = useState(false);

  const [rooms, setRooms] = useState<any[]>(initialRooms);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [selectedRoomForInbox, setSelectedRoomForInbox] = useState<any | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    setExperiences(initialExperiences);
  }, [initialExperiences]);

  useEffect(() => {
    setStudies(initialStudies);
  }, [initialStudies]);

  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  useEffect(() => {
    setCertificates(initialCertificates);
  }, [initialCertificates]);

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

  const [movingId, setMovingId] = useState<string | null>(null);

  const handleMoveOrder = async (
    entity: "experience" | "certificate" | "project" | "study" | "skillGroup",
    id: string,
    direction: "up" | "down",
  ) => {
    if (movingId) return;
    setMovingId(id);

    if (entity === "experience") {
      setExperiences((prev) => {
        const idx = prev.findIndex((item) => item.id === id);
        if (idx === -1) return prev;
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;
        const copy = [...prev];
        const [item] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, item);
        return copy.map((it, i) => ({ ...it, order: i + 1 }));
      });
    } else if (entity === "certificate") {
      setCertificates((prev) => {
        const idx = prev.findIndex((item) => item.id === id);
        if (idx === -1) return prev;
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;
        const copy = [...prev];
        const [item] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, item);
        return copy.map((it, i) => ({ ...it, order: i + 1 }));
      });
    } else if (entity === "project") {
      setProjects((prev) => {
        const idx = prev.findIndex((item) => item.id === id);
        if (idx === -1) return prev;
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;
        const copy = [...prev];
        const [item] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, item);
        return copy.map((it, i) => ({ ...it, order: i + 1 }));
      });
    } else if (entity === "study") {
      setStudies((prev) => {
        const idx = prev.findIndex((item) => item.id === id);
        if (idx === -1) return prev;
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;
        const copy = [...prev];
        const [item] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, item);
        return copy.map((it, i) => ({ ...it, order: i + 1 }));
      });
    } else if (entity === "skillGroup") {
      setSkills((prev) => {
        const idx = prev.findIndex((item) => item.id === id);
        if (idx === -1) return prev;
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;
        const copy = [...prev];
        const [item] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, item);
        return copy.map((it, i) => ({ ...it, order: i + 1 }));
      });
    }

    try {
      await moveOrderAction(entity, id, direction);
    } catch {
      showToast("error", "Gagal memperbarui urutan");
      router.refresh();
    } finally {
      setMovingId(null);
    }
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
                <span className={styles.statusDot} />
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
                <span className={styles.navDash}>—</span>
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
                <span className={styles.navDash}>—</span>
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
                <span className={styles.navDash}>—</span>
                <span>Experiences</span>
              </div>
              <span className={styles.navBadge}>{experiences.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "studies" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("studies");
                setIsCreatingStudy(false);
                setEditingStudy(null);
              }}
            >
              <div className={styles.navItemLeft}>
                <span className={styles.navDash}>—</span>
                <span>Studies</span>
              </div>
              <span className={styles.navBadge}>{studies.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "skills" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("skills");
                setIsCreatingSkill(false);
                setEditingSkill(null);
              }}
            >
              <div className={styles.navItemLeft}>
                <span className={styles.navDash}>—</span>
                <span>Technical Skills</span>
              </div>
              <span className={styles.navBadge}>{skills.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "certificates" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("certificates");
                setIsCreatingCertificate(false);
                setEditingCertificate(null);
                setSelectedRoomForInbox(null);
              }}
            >
              <div className={styles.navItemLeft}>
                <span className={styles.navDash}>—</span>
                <span>Certificates</span>
              </div>
              <span className={styles.navBadge}>{certificates.length}</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${activeTab === "rooms" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("rooms");
                setIsCreatingRoom(false);
                setEditingRoom(null);
                setSelectedRoomForInbox(null);
              }}
            >
              <div className={styles.navItemLeft}>
                <span className={styles.navDash}>—</span>
                <span>Pesan Anonim</span>
              </div>
              <span className={styles.navBadge}>{rooms.length}</span>
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
              <span className={styles.navDash}>←</span>
              <span>Lihat Website</span>
            </div>
            <span style={{ fontSize: 11, opacity: 0.5 }}>↗</span>
          </a>
          <button
            type="button"
            className={styles.navItem}
            style={{ color: "#f87171" }}
            onClick={handleLogout}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navDash}>×</span>
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
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreatingProject(true);
                  }}
                >
                  + Tambah Project Baru
                </button>
              )}
            </div>

            {isCreatingProject || editingProject ? (
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
                {projects.map((proj, index: number) => {
                  const idTrans = proj.translations?.find((t: any) => t.locale === "id") || {};
                  const enTrans = proj.translations?.find((t: any) => t.locale === "en") || {};
                  const coverImg = Array.isArray(proj.images) ? proj.images[0] : "";

                  return (
                    <div key={proj.id} className={styles.itemCard}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}
                      >
                        <OrderButtons
                          order={proj.order ?? index + 1}
                          isFirst={index === 0}
                          isLast={index === projects.length - 1}
                          disabled={movingId !== null}
                          onUp={() => handleMoveOrder("project", proj.id, "up")}
                          onDown={() => handleMoveOrder("project", proj.id, "down")}
                        />
                        {coverImg ? (
                          coverImg.endsWith(".webm") ? (
                            <video
                              src={coverImg}
                              muted
                              autoPlay
                              loop
                              playsInline
                              style={{
                                width: 80,
                                height: 52,
                                objectFit: "cover",
                                borderRadius: 6,
                                flexShrink: 0,
                              }}
                            />
                          ) : (
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
                          )
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
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
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
                            <code>#{proj.order ?? 0}</code> • <code>/{proj.slug}</code>{" "}
                            {proj.publishedAt &&
                              `• ${new Date(proj.publishedAt).toISOString().split("T")[0]}`}{" "}
                            {enTrans.title && `• EN: ${enTrans.title}`}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}
                      >
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
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingExperience(null);
                    setIsCreatingExperience(true);
                  }}
                >
                  + Tambah Pengalaman
                </button>
              )}
            </div>

            {isCreatingExperience || editingExperience ? (
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
                {experiences.map((exp: any, index: number) => {
                  const idTrans = exp.translations?.find((t: any) => t.locale === "id") || {};
                  return (
                    <div key={exp.id} className={styles.itemCard}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <OrderButtons
                          order={exp.order ?? index + 1}
                          isFirst={index === 0}
                          isLast={index === experiences.length - 1}
                          disabled={movingId !== null}
                          onUp={() => handleMoveOrder("experience", exp.id, "up")}
                          onDown={() => handleMoveOrder("experience", exp.id, "down")}
                        />
                        <div>
                          <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                            {exp.company}
                          </div>
                          <div
                            style={{
                              fontSize: "12.5px",
                              color: "rgba(255,255,255,0.45)",
                              marginTop: 2,
                            }}
                          >
                            {idTrans.role} • {exp.timeframe}
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

        {/* TAB 4: STUDIES */}
        {activeTab === "studies" && (
          <div>
            <div className={styles.contentHeader}>
              <div className={styles.pageTitleGroup}>
                <h1>Studies & Education</h1>
                <p>Kelola riwayat pendidikan formal dan institusi.</p>
              </div>
              {!isCreatingStudy && !editingStudy && (
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingStudy(null);
                    setIsCreatingStudy(true);
                  }}
                >
                  + Tambah Riwayat Studi
                </button>
              )}
            </div>

            {isCreatingStudy || editingStudy ? (
              <StudyForm
                study={editingStudy}
                onCancel={() => {
                  setIsCreatingStudy(false);
                  setEditingStudy(null);
                }}
                onSave={() => {
                  setIsCreatingStudy(false);
                  setEditingStudy(null);
                  showToast("success", "Riwayat studi berhasil disimpan!");
                  router.refresh();
                }}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {studies.map((item: any, index: number) => {
                  const idTrans = item.translations?.find((t: any) => t.locale === "id") || {};
                  return (
                    <div key={item.id} className={styles.itemCard}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <OrderButtons
                          order={item.order ?? index + 1}
                          isFirst={index === 0}
                          isLast={index === studies.length - 1}
                          disabled={movingId !== null}
                          onUp={() => handleMoveOrder("study", item.id, "up")}
                          onDown={() => handleMoveOrder("study", item.id, "down")}
                        />
                        <div>
                          <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                            {item.institution}
                          </div>
                          <div style={{ fontSize: "13px", color: "#34d399", marginTop: 2 }}>
                            {idTrans.degree || "Studi"} •{" "}
                            <span style={{ color: "rgba(255,255,255,0.45)" }}>
                              {item.timeframe}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => {
                            setIsCreatingStudy(false);
                            setEditingStudy(item);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={async () => {
                            if (confirm(`Hapus riwayat studi ${item.institution}?`)) {
                              await deleteStudyAction(item.id);
                              setStudies(studies.filter((s: any) => s.id !== item.id));
                              showToast("success", "Riwayat studi dihapus");
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

        {/* TAB 5: SKILLS */}
        {activeTab === "skills" && (
          <div>
            <div className={styles.contentHeader}>
              <div className={styles.pageTitleGroup}>
                <h1>Technical Skills</h1>
                <p>Kelola kelompok keahlian teknologi dan tag skill.</p>
              </div>
              {!isCreatingSkill && !editingSkill && (
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingSkill(null);
                    setIsCreatingSkill(true);
                  }}
                >
                  + Tambah Kelompok Skill
                </button>
              )}
            </div>

            {isCreatingSkill || editingSkill ? (
              <SkillGroupForm
                skillGroup={editingSkill}
                onCancel={() => {
                  setIsCreatingSkill(false);
                  setEditingSkill(null);
                }}
                onSave={() => {
                  setIsCreatingSkill(false);
                  setEditingSkill(null);
                  showToast("success", "Kelompok skill berhasil disimpan!");
                  router.refresh();
                }}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {skills.map((sg: any, index: number) => {
                  const idTrans = sg.translations?.find((t: any) => t.locale === "id") || {};
                  const skillList = Array.isArray(sg.skills)
                    ? sg.skills.map((s: any) => (typeof s === "string" ? s : s.name))
                    : [];
                  return (
                    <div key={sg.id} className={styles.itemCard}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <OrderButtons
                          order={sg.order ?? index + 1}
                          isFirst={index === 0}
                          isLast={index === skills.length - 1}
                          disabled={movingId !== null}
                          onUp={() => handleMoveOrder("skillGroup", sg.id, "up")}
                          onDown={() => handleMoveOrder("skillGroup", sg.id, "down")}
                        />
                        <div>
                          <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                            {idTrans.title || sg.title}
                          </div>
                          <div
                            style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: 6 }}
                          >
                            {skillList.map((tag: string) => (
                              <span
                                key={tag}
                                className={styles.langPill}
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                              >
                                <UniversalIcon
                                  name={resolveIconifyName(tag)}
                                  size={14}
                                  color="#34d399"
                                />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => {
                            setIsCreatingSkill(false);
                            setEditingSkill(sg);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={async () => {
                            if (confirm(`Hapus kelompok skill ${sg.title}?`)) {
                              await deleteSkillGroupAction(sg.id);
                              setSkills(skills.filter((s: any) => s.id !== sg.id));
                              showToast("success", "Kelompok skill dihapus");
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

        {/* TAB 6: CERTIFICATES */}
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
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingCertificate(null);
                    setIsCreatingCertificate(true);
                  }}
                >
                  + Tambah Sertifikat
                </button>
              )}
            </div>

            {isCreatingCertificate || editingCertificate ? (
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
                {certificates.map((cert: any, index: number) => (
                  <div key={cert.id} className={styles.itemCard}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <OrderButtons
                        order={cert.order ?? index + 1}
                        isFirst={index === 0}
                        isLast={index === certificates.length - 1}
                        disabled={movingId !== null}
                        onUp={() => handleMoveOrder("certificate", cert.id, "up")}
                        onDown={() => handleMoveOrder("certificate", cert.id, "down")}
                      />
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
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: "14.5px", fontWeight: 600, color: "#fff" }}>
                          {cert.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12.5px",
                            color: "rgba(255,255,255,0.45)",
                            marginTop: 2,
                          }}
                        >
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

        {activeTab === "rooms" && (
          <div>
            {selectedRoomForInbox ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedRoomForInbox(null)}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                      padding: "8px 14px",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>←</span>
                    <span>Kembali ke Daftar Ruang</span>
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <a
                      href={`/${selectedRoomForInbox.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        background: "rgba(56, 189, 248, 0.1)",
                        color: "#38bdf8",
                        fontSize: "13px",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>Buka Form Publik</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                <div className={styles.glassCard} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", color: "#fff" }}>
                        {selectedRoomForInbox.title}
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        <span>Slug: /{selectedRoomForInbox.slug}</span>
                        <span>•</span>
                        <span
                          style={{
                            color: selectedRoomForInbox.isActive ? "#34d399" : "#f87171",
                          }}
                        >
                          {selectedRoomForInbox.isActive ? "Status: Aktif" : "Status: Nonaktif"}
                        </span>
                      </div>
                      {selectedRoomForInbox.description && (
                        <p
                          style={{
                            margin: "8px 0 0 0",
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          {selectedRoomForInbox.description}
                        </p>
                      )}
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#fff",
                      }}
                    >
                      Total Pesan: <strong>{selectedRoomForInbox.messages?.length || 0}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {!selectedRoomForInbox.messages || selectedRoomForInbox.messages.length === 0 ? (
                    <div
                      className={styles.glassCard}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      Belum ada pesan yang masuk untuk ruang ini.
                    </div>
                  ) : (
                    selectedRoomForInbox.messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={styles.glassCard}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          padding: "16px 20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            paddingBottom: "8px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: msg.senderTag
                                  ? "rgba(56, 189, 248, 0.15)"
                                  : "rgba(255,255,255,0.08)",
                                color: msg.senderTag ? "#38bdf8" : "rgba(255,255,255,0.7)",
                                fontSize: "12px",
                                fontWeight: 500,
                              }}
                            >
                              {msg.senderTag ? msg.senderTag : "Anonim"}
                            </span>
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                              {new Date(msg.createdAt).toLocaleString("id-ID", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>
                          <button
                            type="button"
                            style={{
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.25)",
                              color: "#f87171",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            onClick={async () => {
                              if (confirm("Hapus pesan ini?")) {
                                await deleteAnonymousMessageAction(msg.id);
                                const updatedMessages = selectedRoomForInbox.messages.filter(
                                  (m: any) => m.id !== msg.id,
                                );
                                const updatedSelected = {
                                  ...selectedRoomForInbox,
                                  messages: updatedMessages,
                                };
                                setSelectedRoomForInbox(updatedSelected);
                                setRooms((prev) =>
                                  prev.map((r) =>
                                    r.id === selectedRoomForInbox.id ? updatedSelected : r,
                                  ),
                                );
                                showToast("success", "Pesan berhasil dihapus");
                                router.refresh();
                              }
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            lineHeight: "1.6",
                            whiteSpace: "pre-wrap",
                            color: "#f1f5f9",
                          }}
                        >
                          {msg.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2>Ruang Pesan Anonim</h2>
                    <p>
                      Kelola slug ruang untuk mahasiswa/praktikan kirim pesan anonim, jadwal
                      buka-tutup, dan status aktif.
                    </p>
                  </div>
                  {!isCreatingRoom && !editingRoom && (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => {
                        setIsCreatingRoom(true);
                        setEditingRoom(null);
                      }}
                    >
                      + Buat Ruang Pesan
                    </button>
                  )}
                </div>

                {(isCreatingRoom || editingRoom) && (
                  <RoomForm
                    room={editingRoom}
                    onCancel={() => {
                      setIsCreatingRoom(false);
                      setEditingRoom(null);
                    }}
                    onSave={() => {
                      setIsCreatingRoom(false);
                      setEditingRoom(null);
                      showToast("success", "Ruang pesan berhasil disimpan!");
                      router.refresh();
                    }}
                  />
                )}

                {rooms.length === 0 && !isCreatingRoom && (
                  <div
                    className={styles.glassCard}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "rgba(255, 255, 255, 0.45)",
                    }}
                  >
                    Belum ada ruang pesan anonim. Klik &quot;+ Buat Ruang Pesan&quot; untuk membuat.
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {rooms.map((room) => {
                    const now = new Date();
                    const notYetOpen = room.openAt && now < new Date(room.openAt);
                    const isClosed = room.closeAt && now > new Date(room.closeAt);
                    let scheduleText = "Menerima Pesan";
                    let scheduleColor = "#34d399";

                    if (!room.isActive) {
                      scheduleText = "Nonaktif";
                      scheduleColor = "#94a3b8";
                    } else if (notYetOpen) {
                      scheduleText = `Belum Buka (Buka: ${new Date(room.openAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })})`;
                      scheduleColor = "#fbbf24";
                    } else if (isClosed) {
                      scheduleText = `Sudah Ditutup (${new Date(room.closeAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })})`;
                      scheduleColor = "#f87171";
                    }

                    return (
                      <div key={room.id} className={styles.itemCard}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span style={{ fontWeight: 600, fontSize: "15px", color: "#fff" }}>
                              {room.title}
                            </span>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: `${scheduleColor}20`,
                                color: scheduleColor,
                                fontSize: "11px",
                                fontWeight: 500,
                              }}
                            >
                              {scheduleText}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              fontSize: "13px",
                            }}
                          >
                            <span style={{ color: "#38bdf8", fontFamily: "monospace" }}>
                              /{room.slug}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const fullUrl = `${window.location.origin}/${room.slug}`;
                                navigator.clipboard.writeText(fullUrl);
                                setCopiedSlug(room.slug);
                                setTimeout(() => setCopiedSlug(null), 2000);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color:
                                  copiedSlug === room.slug ? "#34d399" : "rgba(255,255,255,0.45)",
                                fontSize: "12px",
                                cursor: "pointer",
                                padding: 0,
                                textDecoration: "underline",
                              }}
                            >
                              {copiedSlug === room.slug ? "Tersalin!" : "Salin Link"}
                            </button>
                            <a
                              href={`/${room.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "rgba(255,255,255,0.45)",
                                fontSize: "12px",
                                textDecoration: "none",
                              }}
                            >
                              Buka ↗
                            </a>
                          </div>

                          {room.description && (
                            <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.45)" }}>
                              {room.description}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexShrink: 0,
                          }}
                        >
                          <button
                            type="button"
                            style={{
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: "1px solid rgba(56, 189, 248, 0.3)",
                              background: "rgba(56, 189, 248, 0.12)",
                              color: "#38bdf8",
                              fontSize: "12.5px",
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                            onClick={() => setSelectedRoomForInbox(room)}
                          >
                            Inbox ({room.messages?.length || 0})
                          </button>
                          <button
                            type="button"
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "1px solid rgba(255,255,255,0.12)",
                              background: "rgba(255,255,255,0.05)",
                              color: "#fff",
                              fontSize: "12.5px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setIsCreatingRoom(false);
                              setEditingRoom(room);
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
                              if (
                                confirm(`Hapus ruang "${room.title}" beserta seluruh pesannya?`)
                              ) {
                                await deleteMessageRoomAction(room.id);
                                setRooms(rooms.filter((r) => r.id !== room.id));
                                showToast("success", "Ruang pesan dihapus");
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
