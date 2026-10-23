import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Najmi Folio",
  robots: { index: false, follow: false },
};

// With the site shell living in app/[locale], unmatched URLs have no root
// layout to fall back on, so this file carries its own document and a real
// 404 status.
export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "#08090d",
          color: "#f1f5f9",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 64, margin: 0, fontWeight: 700 }}>404</p>
        <h1 style={{ margin: 0, fontSize: 24 }}>Page Not Found</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>The page you are looking for does not exist.</p>
        <a href="/" style={{ color: "#7dd3fc" }}>
          Back to home
        </a>
      </body>
    </html>
  );
}
