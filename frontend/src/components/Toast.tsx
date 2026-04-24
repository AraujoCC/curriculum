import { useEffect, useState } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function toast(message: string, type: Toast["type"] = "info") {
  const newToast: Toast = { id: ++toastId, message, type };
  listeners.forEach((listener) => listener(newToast));
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToast: Toast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return toasts;
}

const toastStyles: Record<Toast["type"], string> = {
  success: "#10b981",
  error: "#f43f5e",
  info: "#3b82f6",
};

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        borderRadius: "8px",
        background: "#1a1a1a",
        border: `1px solid ${toastStyles[toast.type]}`,
        color: "#f1f1f1",
        fontSize: "14px",
        fontFamily: "'IBM Plex Mono', monospace",
        animation: "slideIn 0.3s ease",
        maxWidth: "320px",
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: toastStyles[toast.type],
        }}
      />
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}

interface ToastContainerProps {
  toasts?: Toast[];
}

export function ToastContainer({ toasts = [] }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 9999,
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}