"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
        background: "radial-gradient(ellipse at 50% 20%, rgba(59, 130, 246, 0.12), transparent 70%), #050508",
      }}
    >
      <div
        className={styles.glassCard}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" }}>
          <div className={styles.brandLogo} style={{ width: 44, height: 44, fontSize: 22 }}>
            ⚡
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
            Najmi Folio CMS
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.45)", margin: 0 }}>
            Panel kontrol konten dinamis & media
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className={styles.formGroup}>
            <label htmlFor="admin-pass">Password Akses</label>
            <input
              id="admin-pass"
              type="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password admin"
              autoFocus
              required
            />
          </div>

          {error && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                fontSize: "12.5px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "11px 16px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#ffffff",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
            }}
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard →"}
          </button>
        </form>

        <div style={{ textAlign: "center", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a
            href="/"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            ← Kembali ke Website Utama
          </a>
        </div>
      </div>
    </div>
  );
}
