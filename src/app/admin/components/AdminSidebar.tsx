"use client";

import { Button, Column, IconButton, Row, SmartLink, StatusIndicator, Text } from "@once-ui-system/core";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/authenticate", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { href: "/admin/projects", label: "Projects", count: counts.projects },
    { href: "/admin/profile", label: "Profile & Bio" },
    { href: "/admin/experiences", label: "Experiences", count: counts.experiences },
    { href: "/admin/studies", label: "Studies", count: counts.studies },
    { href: "/admin/skills", label: "Technical Skills", count: counts.skills },
    { href: "/admin/certificates", label: "Certificates", count: counts.certificates },
    { href: "/admin/rooms", label: "Pesan Anonim", count: counts.rooms },
  ];

  const SidebarContent = () => (
    <>
      <Column gap="m">
        {/* Brand */}
        <Row gap="12" vertical="center" paddingBottom="m" borderBottom="neutral-alpha-weak">
          <Row
            center
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--neutral-background-strong)",
              border: "1px solid var(--border-neutral-alpha-medium)",
              fontWeight: 600,
              fontSize: 13,
              color: "var(--neutral-on-background-strong)",
              flexShrink: 0,
            }}
          >
            NF
          </Row>
          <Column gap="2">
            <Text variant="label-strong-s" onBackground="neutral-strong">
              Najmi CMS
            </Text>
            <Row gap="4" vertical="center">
              <StatusIndicator color="emerald" size="s" ariaLabel="DB live" />
              <Text variant="label-default-xs" onBackground="neutral-weak">
                PostgreSQL Live
              </Text>
            </Row>
          </Column>
        </Row>

        {/* Nav items */}
        <Column gap="2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <SmartLink
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none" }}
                onClick={() => setMobileOpen(false)}
              >
                <Row
                  vertical="center"
                  horizontal="between"
                  paddingX="12"
                  paddingY="8"
                  border={isActive ? "neutral-alpha-medium" : undefined}
                  background={isActive ? "neutral-alpha-weak" : "transparent"}
                  radius="m"
                  style={{ transition: "all 0.15s ease" }}
                >
                  <Row gap="8" vertical="center">
                    <Text
                      variant="label-default-xs"
                      style={{
                        color: isActive
                          ? "var(--accent-on-background-medium)"
                          : "var(--neutral-on-background-weak)",
                      }}
                    >
                      —
                    </Text>
                    <Text
                      variant="label-default-s"
                      onBackground={isActive ? "neutral-strong" : "neutral-weak"}
                      style={{ fontWeight: isActive ? 500 : 400 }}
                    >
                      {item.label}
                    </Text>
                  </Row>
                  {item.count !== undefined && (
                    <Text
                      variant="label-default-xs"
                      style={{
                        padding: "1px 7px",
                        borderRadius: 9999,
                        background: isActive
                          ? "var(--accent-background-weak)"
                          : "var(--neutral-background-weak)",
                        border: `1px solid ${isActive ? "var(--accent-border-weak)" : "var(--border-neutral-alpha-weak)"}`,
                        color: isActive
                          ? "var(--accent-on-background-medium)"
                          : "var(--neutral-on-background-weak)",
                      }}
                    >
                      {item.count}
                    </Text>
                  )}
                </Row>
              </SmartLink>
            );
          })}
        </Column>
      </Column>

      {/* Footer */}
      <Column gap="4" paddingTop="m" borderTop="neutral-alpha-weak">
        <SmartLink
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Row vertical="center" horizontal="between" paddingX="12" paddingY="8" radius="m">
            <Row gap="8" vertical="center">
              <Text variant="label-default-xs" onBackground="neutral-weak">←</Text>
              <Text variant="label-default-s" onBackground="neutral-weak">Lihat Website</Text>
            </Row>
          </Row>
        </SmartLink>
        <Button variant="danger" size="s" fillWidth label="Keluar" onClick={handleLogout} />
      </Column>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — hidden on ≤1024px via CSS class */}
      <Column
        as="aside"
        fillHeight
        vertical="between"
        paddingX="20"
        paddingY="24"
        className="admin-desktop-only"
        style={{
          width: 260,
          flexShrink: 0,
          background: "var(--page-background)",
          borderRight: "1px solid var(--border-neutral-alpha-weak)",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 10,
        }}
      >
        <SidebarContent />
      </Column>

      {/* Mobile topbar — visible only on ≤1024px */}
      <Row
        fillWidth
        vertical="center"
        horizontal="between"
        paddingX="16"
        paddingY="12"
        className="admin-mobile-only"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "var(--page-background)",
          borderBottom: "1px solid var(--border-neutral-alpha-weak)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Text variant="label-strong-s" onBackground="neutral-strong">Najmi CMS</Text>
        <IconButton
          variant="secondary"
          size="m"
          icon={mobileOpen ? "close" : "menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
          tooltip="Menu"
        />
      </Row>

      {/* Mobile overlay — hanya tampil saat drawer open */}
      {mobileOpen && (
        <div
          className="admin-mobile-only admin-mobile-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer — slide in dari kiri */}
      <Column
        vertical="between"
        paddingX="20"
        paddingY="24"
        className="admin-mobile-only"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          zIndex: 101,
          background: "var(--page-background)",
          borderRight: "1px solid var(--border-neutral-alpha-weak)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          overflowY: "auto",
          boxShadow: mobileOpen ? "4px 0 24px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <Row vertical="center" horizontal="between" paddingBottom="s" borderBottom="neutral-alpha-weak">
          <Text variant="label-strong-s" onBackground="neutral-strong">Menu</Text>
          <IconButton
            variant="secondary"
            size="s"
            icon="close"
            onClick={() => setMobileOpen(false)}
            tooltip="Tutup"
          />
        </Row>
        <SidebarContent />
      </Column>
    </>
  );
}
