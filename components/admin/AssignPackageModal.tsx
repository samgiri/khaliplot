"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { PARTNER_TYPES, PARTNER_TYPE_LABELS, type PartnerType } from "@/lib/partner-types";
import { PACKAGE_TYPES, getPackageType } from "@/lib/package-types";

export interface PackageTargetUser {
  id: string;
  name: string | null;
  email: string | null;
  partner_type: string | null;
}

const DURATION_PRESETS = [7, 30, 90, 365] as const;
type DurationOption = (typeof DURATION_PRESETS)[number] | "custom";
const NOTES_MAX = 200;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysStr(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function searchLabel(u: { name: string | null; email: string | null }): string {
  return u.name || u.email || "Unnamed user";
}

/**
 * Modal for granting a user a package (subscription tier) tagged with
 * Partner Type + Notes. Pass `presetUser` when opened from a known row (the
 * Users table); omit it to show a user search (the Packages tab's top-level
 * "Assign Package" action).
 */
export default function AssignPackageModal({
  presetUser,
  onClose,
  onAssigned,
}: {
  presetUser?: PackageTargetUser;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<PackageTargetUser | null>(presetUser ?? null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PackageTargetUser[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [packageKey, setPackageKey] = useState("");
  const [partnerType, setPartnerType] = useState<PartnerType | "">(
    (presetUser?.partner_type as PartnerType) || ""
  );
  const [startDate, setStartDate] = useState(todayStr());
  const [duration, setDuration] = useState<DurationOption>(30);
  const [endDate, setEndDate] = useState(addDaysStr(todayStr(), 30));
  const [isPromotional, setIsPromotional] = useState(true);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced user search — only relevant when no presetUser was passed in.
  useEffect(() => {
    if (presetUser) return;
    const trimmed = query.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!trimmed) {
        setResults([]);
        return;
      }
      setSearching(true);
      fetch(`/api/admin/users?q=${encodeURIComponent(trimmed)}&limit=8`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
        .then((d) => setResults(d.users ?? []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, presetUser]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function applyDuration(option: DurationOption, fromDate: string) {
    setDuration(option);
    if (option !== "custom") setEndDate(addDaysStr(fromDate, option));
  }

  function handlePackageKeyChange(key: string) {
    setPackageKey(key);
    const def = getPackageType(key);
    if (!def) return;
    setAmount(String(def.defaultAmount));
    if (def.defaultDurationDays == null) {
      setDuration("custom");
      setEndDate("");
    } else if ((DURATION_PRESETS as readonly number[]).includes(def.defaultDurationDays)) {
      applyDuration(def.defaultDurationDays as DurationOption, startDate);
    } else {
      setDuration("custom");
      setEndDate(addDaysStr(startDate, def.defaultDurationDays));
    }
  }

  function handleStartDateChange(value: string) {
    setStartDate(value);
    if (duration !== "custom") setEndDate(addDaysStr(value, duration));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) {
      setError("Choose a user first.");
      return;
    }
    if (!packageKey) {
      setError("Choose a package type.");
      return;
    }
    setSaving(true);
    setError("");

    const startedAt = new Date(`${startDate}T00:00:00`).toISOString();
    const expiresAt = endDate ? new Date(`${endDate}T00:00:00`).toISOString() : null;

    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser.id,
          package_key: packageKey,
          partner_type: partnerType || null,
          notes,
          is_promotional: isPromotional,
          amount: isPromotional ? 0 : Number(amount) || 0,
          started_at: startedAt,
          expires_at: expiresAt,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to assign package");
      }
      onAssigned();
      setSuccess(true);
      closeTimerRef.current = setTimeout(onClose, 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign package");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 p-4 sm:p-8">
      <div className="w-full max-w-lg rounded-xl border-2 border-navy bg-paper p-5 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy">Assign package</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={22} className="text-navy" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-pale text-green">
              <Check size={26} />
            </div>
            <p className="font-display font-semibold text-navy">Package assigned successfully</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-1 rounded-md border border-line px-4 py-2 text-sm font-semibold text-navy hover:border-green-bright"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {presetUser ? (
              <div className="rounded-md border border-line bg-white px-3 py-2.5 text-sm">
                <span className="font-semibold text-navy">{searchLabel(presetUser)}</span>
                {presetUser.email && presetUser.name && (
                  <span className="ml-1.5 text-muted">{presetUser.email}</span>
                )}
              </div>
            ) : (
              <div className="relative">
                <label className="text-sm font-semibold text-navy">User</label>
                {selectedUser ? (
                  <div className="mt-1.5 flex items-center justify-between rounded-md border border-line bg-white px-3 py-2.5 text-sm">
                    <span>
                      <span className="font-semibold text-navy">{searchLabel(selectedUser)}</span>
                      {selectedUser.email && selectedUser.name && (
                        <span className="ml-1.5 text-muted">{selectedUser.email}</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="text-xs font-semibold text-amber-dark"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search by name, email or phone…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                    />
                    {(searching || results.length > 0) && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border border-line bg-white shadow-lg">
                        {searching && <p className="px-3 py-2 text-xs text-muted">Searching…</p>}
                        {!searching &&
                          results.map((u) => (
                            <button
                              type="button"
                              key={u.id}
                              onClick={() => {
                                setSelectedUser(u);
                                setResults([]);
                                setQuery("");
                              }}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-paper-dim"
                            >
                              <span className="font-medium text-navy">{searchLabel(u)}</span>
                              {u.email && u.name && <span className="ml-1.5 text-muted">{u.email}</span>}
                            </button>
                          ))}
                        {!searching && results.length === 0 && query.trim() && (
                          <p className="px-3 py-2 text-xs text-muted">No users found.</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-navy">Package type</label>
                <select
                  required
                  value={packageKey}
                  onChange={(e) => handlePackageKeyChange(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {PACKAGE_TYPES.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-navy">Partner type</label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value as PartnerType | "")}
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                >
                  <option value="">—</option>
                  {PARTNER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {PARTNER_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-navy">Duration</label>
                <select
                  value={duration}
                  onChange={(e) =>
                    applyDuration(
                      e.target.value === "custom" ? "custom" : (Number(e.target.value) as DurationOption),
                      startDate
                    )
                  }
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                >
                  {DURATION_PRESETS.map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="flex items-end gap-2 pb-2.5">
                <input
                  id="promo"
                  type="checkbox"
                  checked={isPromotional}
                  onChange={(e) => setIsPromotional(e.target.checked)}
                  className="h-4 w-4 accent-green"
                />
                <label htmlFor="promo" className="text-sm font-semibold text-navy">
                  Promotional (free)
                </label>
              </div>

              <div>
                <label className="text-sm font-semibold text-navy">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-navy">
                  End date {duration !== "custom" && <span className="font-normal text-muted">(auto)</span>}
                </label>
                <input
                  type="date"
                  value={endDate}
                  disabled={duration !== "custom"}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  placeholder="No expiry"
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright disabled:bg-paper-dim disabled:text-muted"
                />
              </div>

              {!isPromotional && (
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-navy">Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-navy">Notes</label>
                  <span className="text-xs text-muted">
                    {notes.length}/{NOTES_MAX}
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={NOTES_MAX}
                  placeholder="e.g. Local dealer onboarding, 3-month featured trial"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                />
              </div>
            </div>

            {error && <p className="text-sm text-amber-dark">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-line px-4 py-2 font-semibold text-navy hover:border-green-bright"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-green px-5 py-2 font-semibold text-paper hover:bg-navy disabled:opacity-60"
              >
                {saving ? "Assigning…" : "Assign package"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
