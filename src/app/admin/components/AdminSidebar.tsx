"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "../admin.module.scss";

export interface AdminCounts {
  projects: number;
  experiences: number;
  studies: number;
  skills: number;
  certificates: number;
  rooms: number;
}

export default function AdminSidebar({ counts }: { counts: AdminCounts }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/authenticate", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    {
      href: "/admin/projects",
      label: "Projects",
      count: counts.projects,
    },
    {
      href: "/admin/profile",
      label: "Profile & Bio",
    },
    {
      href: "/admin/experiences",
      label: "Experiences",
      count: counts.experiences,
    },
    {
      href: "/admin/studies",
      label: "Studies",
      count: counts.studies,
    },
    {
      href: "/admin/skills",
      label: "Technical Skills",
      count: counts.skills,
    },
    {
      href: "/admin/certificates",
      label: "Certificates",
      count: counts.certificates,
    },
    {
      href: "/admin/rooms",
      label: "Pesan Anonim",
      count: counts.rooms,
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>NF</div>
          <div className={styles.brandText}>
            <span>Najmi CMS</span>
            <span>
              <span className={styles.statusDot} />
              PostgreSQL Live
            </span>
          </div>
        </div>

        <nav className={styles.navGroup}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <div className={styles.navItemLeft}>
                  <span className={styles.navDash}>—</span>
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && <span className={styles.navBadge}>{item.count}</span>}
              </Link>
            );
          })}
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
  );
}
