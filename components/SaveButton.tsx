"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { showToast } from "@/components/Toaster";

interface SaveButtonProps {
  plotId: string;
  initialSaved?: boolean;
  variant?: "icon" | "labeled";
  className?: string;
}

export default function SaveButton({
  plotId,
  initialSaved = false,
  variant = "icon",
  className = "",
}: SaveButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    setBusy(true);
    const nextSaved = !saved;
    setSaved(nextSaved); // optimistic

    try {
      const res = await fetch("/api/saved-plots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plotId, action: nextSaved ? "save" : "unsave" }),
      });

      if (res.status === 401) {
        setSaved(!nextSaved); // revert optimistic change
        showToast("Sign in to save plots", "info");
        return;
      }
      if (!res.ok) {
        setSaved(!nextSaved); // revert on failure
        showToast("Something went wrong. Try again.", "info");
        return;
      }
      showToast(nextSaved ? "Plot saved!" : "Removed from saved");
      router.refresh();
    } catch {
      setSaved(!nextSaved);
      showToast("Something went wrong. Try again.", "info");
    } finally {
      setBusy(false);
    }
  }

  if (variant === "labeled") {
    return (
      <button
        onClick={toggle}
        disabled={busy}
        className={`flex items-center justify-center gap-2 rounded-md border px-4 py-3 font-semibold transition-colors disabled:opacity-60 ${
          saved
            ? "border-amber bg-amber/10 text-amber-dark"
            : "border-line bg-white text-navy hover:border-green-bright"
        } ${className}`}
      >
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={saved ? "currentColor" : "none"} />}
        {saved ? "Saved" : "Save plot"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? "Remove from saved plots" : "Save plot"}
      aria-pressed={saved}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-navy shadow-sm transition-transform hover:scale-105 disabled:opacity-60 ${className}`}
    >
      {busy ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Heart size={16} className={saved ? "text-amber" : "text-navy/60"} fill={saved ? "currentColor" : "none"} />
      )}
    </button>
  );
}
