"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Mail } from "lucide-react";

const inquiryTypes = [
  { value: "buying", label: "Buying a plot" },
  { value: "selling", label: "Selling a plot" },
  { value: "listing", label: "Help with my listing" },
  { value: "pricing", label: "Pricing / packages" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("buying");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, inquiryType, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setInquiryType("buying");
      setMessage("");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-line bg-paper-dim p-6 text-center">
        <CheckCircle2 size={28} className="text-green" />
        <p className="font-display font-semibold text-navy">
          ✅ Thank you! We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-green hover:text-navy"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-navy">
            Name
          </label>
          <input
            id="name"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-semibold text-navy">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-navy">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiryType" className="text-sm font-semibold text-navy">
          What&apos;s this about?
        </label>
        <select
          id="inquiryType"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
        >
          {inquiryTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-semibold text-navy">
          Message
        </label>
        <textarea
          id="message"
          required
          maxLength={2000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a bit more..."
          className="w-full resize-none rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
        />
      </div>

      {status === "error" && (
        <div className="rounded-lg border border-line bg-paper-dim p-4 text-sm">
          <p className="text-amber-dark">{errorMessage}</p>
          <p className="mt-2 text-muted">You can also reach us directly:</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <a
              href="https://wa.me/919625763256"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-green hover:text-navy"
            >
              <MessageCircle size={16} />
              WhatsApp us
            </a>
            <a
              href="mailto:hello@khaliplot.in"
              className="flex items-center gap-1.5 font-semibold text-green hover:text-navy"
            >
              <Mail size={16} />
              hello@khaliplot.in
            </a>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-amber-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "📨 Send Message →"}
      </button>
    </form>
  );
}
