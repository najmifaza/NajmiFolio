"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import styles from "../admin.module.scss";

interface ToastState {
  type: "success" | "error";
  text: string;
}

interface ToastContextType {
  showToast: (type: "success" | "error", text: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.text}</span>
        </div>
      )}
      {children}
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  return useContext(ToastContext);
}
