import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Najmi Folio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="dark"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflowY: "auto",
        backgroundColor: "#08090d",
        color: "#f1f5f9",
      }}
    >
      {children}
    </div>
  );
}
