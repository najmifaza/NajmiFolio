"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import styles from "../admin.module.scss";

export default function AdminLoginPage() {
  const router = useRouter();
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
        router.push("/admin");
        router.refresh();
      } else {
        setError("Password salah. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.08), transparent 70%), #050508",
      }}
    >
      <div
        className={styles.glassCard}
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "36px 30px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            textAlign: "center",
          }}
        >
          <div className={styles.brandLogo} style={{ width: 40, height: 40, fontSize: 16 }}>
            N
          </div>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 600,
              margin: 0,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Najmi CMS
          </h1>
          <p style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.45)", margin: 0 }}>
            Panel kontrol konten dinamis & media
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div className={styles.formGroup}>
            <label htmlFor="admin-pass">Password Akses</label>
            <input
              id="admin-pass"
              type="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password admin"
              required
            />
          </div>

          {error && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#fca5a5",
                fontSize: "12px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton}
            style={{ width: "100%", justifyContent: "center", padding: "10px 16px" }}
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard →"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            paddingTop: "8px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <a
            href="/"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
            }}
          >
            ← Kembali ke Website Utama
          </a>
        </div>
      </div>
    </div>
  );
}
