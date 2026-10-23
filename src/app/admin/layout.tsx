import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import { Providers } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Najmi Folio",
  robots: { index: false, follow: false },
};

// Admin lives outside the [locale] tree, so this is its own root layout.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
