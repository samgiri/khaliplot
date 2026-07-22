"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  INDIAN_STATES,
  ROLE_OPTIONS,
  LANGUAGE_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  phoneLocalDigits,
  getCitiesForState,
  type Role,
  type Language,
  type ContactMethod,
} from "@/lib/profile-data";

interface ProfileFormProps {
  email: string | null;
  initialName: string;
  initialPhone: string;
  initialRole: Role | null;
  initialState: string;
  initialCity: string;
  initialPreferredLanguage: Language | null;
  initialPreferredContactMethod: ContactMethod | null;
  showEmail?: boolean;
  showContactMethod?: boolean;
  submitLabel: string;
  redirectTo: string;
}

export default function ProfileForm({
  email,
  initialName,
  initialPhone,
  initialRole,
  initialState,
  initialCity,
  initialPreferredLanguage,
  initialPreferredContactMethod,
  showEmail = false,
  showContactMethod = false,
  submitLabel,
  redirectTo,
}: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(phoneLocalDigits(initialPhone));
  const [role, setRole] = useState<Role | "">(initialRole ?? "");
  const [state, setState] = useState(initialState);
  const [city, setCity] = useState(initialCity);
  const [preferredLanguage, setPreferredLanguage] = useState<Language | "">(
    initialPreferredLanguage ?? ""
  );
  const [preferredContactMethod, setPreferredContactMethod] = useState<ContactMethod | "">(
    initialPreferredContactMethod ?? ""
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          role,
          state,
          city,
          preferredLanguage,
          preferredContactMethod: preferredContactMethod || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      router.push(redirectTo);
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showEmail && email && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-navy">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            disabled
            className="w-full rounded-md border border-line bg-paper-dim px-3 py-2.5 text-sm text-muted"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-navy">
            Full name
          </label>
          <input
            id="name"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-semibold text-navy">
            Phone number
          </label>
          <div className="flex">
            <span className="flex items-center rounded-l-md border border-r-0 border-line bg-paper-dim px-3 text-sm text-muted">
              +91
            </span>
            <input
              id="phone"
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98XXXXXXXX"
              className="w-full rounded-r-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="coord-label mb-2 text-navy/60">I am a</p>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                role === opt.value
                  ? "border-green bg-green-pale"
                  : "border-line bg-white hover:border-green-bright"
              }`}
            >
              <p className="font-display font-semibold text-navy">{opt.label}</p>
              <p className="mt-0.5 text-xs text-muted">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-sm font-semibold text-navy">
            Area
          </label>
          <select
            id="state"
            required
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setCity(""); // old city rarely applies to the newly picked area
            }}
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
          >
            <option value="">Select area</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm font-semibold text-navy">
            City
          </label>
          <input
            id="city"
            required
            list="city-suggestions"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={100}
            placeholder="Start typing your city…"
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
          />
          <datalist id="city-suggestions">
            {getCitiesForState(state).map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <p className="coord-label mb-2 text-navy/60">Preferred language</p>
        <div className="flex gap-3">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPreferredLanguage(opt.value)}
              className={`rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-colors ${
                preferredLanguage === opt.value
                  ? "border-green bg-green text-paper"
                  : "border-line bg-white text-navy hover:border-green-bright"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {showContactMethod && (
        <div>
          <p className="coord-label mb-2 text-navy/60">Preferred contact method</p>
          <div className="flex flex-wrap gap-3">
            {CONTACT_METHOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setPreferredContactMethod(preferredContactMethod === opt.value ? "" : opt.value)
                }
                className={`rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-colors ${
                  preferredContactMethod === opt.value
                    ? "border-green bg-green text-paper"
                    : "border-line bg-white text-navy hover:border-green-bright"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-line bg-paper-dim p-4 text-sm text-amber-dark">
          {errorMessage}
        </div>
      )}
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-lg border border-line bg-paper-dim p-4 text-sm text-green">
          <CheckCircle2 size={18} /> Saved.
        </div>
      )}

      <p className="text-xs text-muted">
        🔒 Your details stay private. We never share your number.
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-amber-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
