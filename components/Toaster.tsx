"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

export type ToastTone = "success" | "info";

export interface ToastDetail {
  message: string;
  tone?: ToastTone;
}

interface Toast extends ToastDetail {
  id: number;
}

const TOAST_EVENT = "khaliplot:toast";

/** Fire a toast from anywhere on the client. */
export function showToast(message: string, tone: ToastTone = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { message, tone } }));
}

let nextId = 1;

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      if (!detail?.message) return;
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message: detail.message, tone: detail.tone ?? "success" }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    }
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-xs items-center gap-2.5 rounded-lg border-2 border-navy bg-white px-4 py-3 text-sm font-semibold text-navy shadow-[3px_3px_0_0_var(--color-navy)]"
        >
          {toast.tone === "info" ? (
            <Info size={18} className="shrink-0 text-amber-dark" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0 text-green" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 text-muted transition-colors hover:text-navy"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
