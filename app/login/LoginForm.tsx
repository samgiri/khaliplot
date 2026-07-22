"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const LAST_EMAIL_KEY = "kp_login_email";

export default function LoginForm() {
  const linkExpired = useSearchParams().get("error") === "expired";

  // If we were bounced back after a failed magic-link exchange (most often:
  // opened on a different browser/device than the one that requested it),
  // prefill whichever email last requested a link on this browser.
  const [email, setEmail] = useState(() =>
    linkExpired && typeof window !== "undefined"
      ? window.localStorage.getItem(LAST_EMAIL_KEY) ?? ""
      : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (signInError) {
        setError("Couldn't send the link. Try again.");
        setLoading(false);
        return;
      }

      window.localStorage.setItem(LAST_EMAIL_KEY, email);
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-line bg-paper-dim p-5 text-center">
        <CheckCircle2 size={28} className="text-green" />
        <p className="font-display font-semibold text-navy">Check your email</p>
        <p className="text-sm text-muted">
          We sent a sign-in link to <span className="font-medium text-navy">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {linkExpired && (
        <div className="flex items-start gap-2 rounded-lg border border-amber/40 bg-amber/10 p-3 text-sm text-amber-dark">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>That link expired or was opened elsewhere — request a new one below.</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-sm font-semibold text-navy">
          Email
        </label>
        <div className="relative mt-1.5">
          <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 pl-10 text-sm focus:border-green-bright"
            autoFocus
          />
        </div>
      </div>

      {error && <p className="text-sm text-amber-dark">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-green px-4 py-2.5 font-semibold text-paper transition-colors hover:bg-navy disabled:opacity-60"
      >
        {loading ? "Sending…" : linkExpired ? "Send new link" : "Send magic link"}
      </button>
    </form>
  );
}
