"use client";

import { useToast } from "@once-ui-system/core";
import type { ReactNode } from "react";

// Shim agar semua consumer lama (showToast) tetap bekerja tanpa ubah signature.
// Once UI ToastProvider sudah ada di Providers.tsx — tidak perlu wrap ulang.
export function useAdminToast() {
  const { addToast } = useToast();
  return {
    showToast: (type: "success" | "error", text: string) =>
      addToast({ variant: type === "error" ? "danger" : "success", message: text }),
  };
}

// No-op wrapper — ToastProvider dari Providers.tsx sudah membungkus tree admin.
export function AdminToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
