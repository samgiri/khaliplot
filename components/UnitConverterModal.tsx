"use client";

import { useEffect, useState } from "react";
import { Calculator, Copy, X } from "lucide-react";
import { LAND_UNITS, convertAll } from "@/lib/unit-converter";
import { showToast } from "@/components/Toaster";

function ConverterModal({
  onClose,
  initialUnit = "sqft",
  initialValue = "2000",
}: {
  onClose: () => void;
  initialUnit?: string;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [fromUnit, setFromUnit] = useState(initialUnit);

  // Close on Escape; lock background scroll while open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const numeric = Number(value);
  const valid = value !== "" && Number.isFinite(numeric) && numeric >= 0;
  const results = valid ? convertAll(numeric, fromUnit) : [];
  const fromLabel = LAND_UNITS.find((u) => u.key === fromUnit)?.label ?? "";

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${text} ${label}`);
    } catch {
      showToast("Couldn't copy — long-press to select", "info");
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-navy/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-label="Land unit converter"
        className="relative flex h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl border-2 border-navy bg-white sm:h-auto sm:max-h-[85vh] sm:max-w-md sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-line bg-navy px-5 py-3.5">
          <h2 className="flex items-center gap-2 font-display font-bold text-paper">
            <Calculator size={18} />
            Unit Converter
          </h2>
          <button onClick={onClose} aria-label="Close converter" className="text-paper/80 hover:text-paper">
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-line bg-paper-dim px-5 py-4">
          <label htmlFor="uc-value" className="coord-label text-navy/60">
            Enter value
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id="uc-value"
              type="number"
              min={0}
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm font-semibold text-navy focus:border-green-bright"
            />
            <select
              aria-label="From unit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
            >
              {LAND_UNITS.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {valid ? (
            <ul className="space-y-1.5">
              {results.map((r) => (
                <li
                  key={r.key}
                  className={`flex items-center justify-between gap-3 rounded-md px-3 py-2.5 ${
                    r.key === fromUnit ? "bg-green-pale" : "bg-paper-dim/60"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm text-ink">
                      <span className="font-display font-bold text-navy">{r.formatted}</span> {r.label}
                    </p>
                    {r.region && <p className="coord-label truncate text-navy/45">{r.region}</p>}
                  </div>
                  <button
                    onClick={() => copy(r.formatted, r.label)}
                    aria-label={`Copy ${r.formatted} ${r.label}`}
                    className="flex shrink-0 items-center gap-1 rounded-md border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-navy"
                  >
                    <Copy size={13} />
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-muted">
              Enter a value to see conversions from {fromLabel || "your unit"}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Self-contained button that opens the converter modal. Drop into any page
 * (server or client) — it owns its own open state.
 */
export default function UnitConverterButton({
  className = "",
  label = "Unit Converter",
  initialUnit = "sqft",
  initialValue = "2000",
}: {
  className?: string;
  label?: string;
  initialUnit?: string;
  initialValue?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center gap-2 rounded-md border border-navy bg-white px-4 py-2 font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
        }
      >
        <Calculator size={16} />
        {label}
      </button>
      {open && (
        <ConverterModal onClose={() => setOpen(false)} initialUnit={initialUnit} initialValue={initialValue} />
      )}
    </>
  );
}
