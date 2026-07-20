"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function TrustBadge() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative mt-3 inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-amber bg-paper px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-navy transition-colors hover:bg-amber-light"
      >
        <ShieldCheck size={12} className="shrink-0" />
        Trust Guarantee
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-2 w-56 rounded-lg border border-amber bg-paper p-3 text-xs leading-relaxed text-navy shadow-[4px_4px_0_0_var(--color-navy)]">
          No genuine reply in 90 days? We add 90 days to your plan, free. No forms, no fuss.
        </div>
      )}
    </div>
  );
}
