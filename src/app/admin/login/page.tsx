"use client";

import { Button, Column, Heading, Input, Row, SmartLink, Text } from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/admin";
        return;
      }

      setError("Password salah. Silakan coba lagi.");
      setLoading(false);
    } catch {
      setError("Terjadi kesalahan koneksi server.");
      setLoading(false);
    }
  };

  return (
    <Row
      center
      fill
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "var(--page-background)",
      }}
    >
      <Column
        background="surface"
        border="neutral-alpha-weak"
        radius="l"
        padding="32"
        gap="24"
        style={{ width: "100%", maxWidth: 380 }}
      >
        <Column horizontal="center" gap="8" style={{ textAlign: "center" }}>
          <Row
            center
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--neutral-background-strong)",
              border: "1px solid var(--border-neutral-alpha-medium)",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--neutral-on-background-strong)",
            }}
          >
            N
          </Row>
          <Heading as="h1" variant="heading-strong-s" onBackground="neutral-strong">
            Najmi CMS
          </Heading>
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Panel kontrol konten dinamis & media
          </Text>
        </Column>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}
        >
          <Input
            id="admin-pass"
            label="Password Akses"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password admin"
            required
          />

          {error && (
            <Row
              padding="12"
              radius="m"
              background="danger-alpha-weak"
              border="danger-alpha-medium"
            >
              <Text variant="label-default-xs" onBackground="danger-medium">
                {error}
              </Text>
            </Row>
          )}

          <Button
            type="submit"
            variant="primary"
            size="m"
            fillWidth
            label={loading ? "Memverifikasi & Masuk..." : "Masuk ke Dashboard →"}
            disabled={loading}
            loading={loading}
          />
        </form>

        <Row horizontal="center" paddingTop="8" borderTop="neutral-alpha-weak">
          <SmartLink href="/" style={{ textDecoration: "none" }}>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              ← Kembali ke Website Utama
            </Text>
          </SmartLink>
        </Row>
      </Column>
    </Row>
  );
}
