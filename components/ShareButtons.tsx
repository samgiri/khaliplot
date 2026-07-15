"use client";

import { useState } from "react";
import { MessageCircle, Link2, Check } from "lucide-react";
import { showToast } from "@/components/Toaster";

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.931-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

/**
 * Share row for articles. Builds share URLs from the current page location on
 * click (so it works on any deployment host) and offers a copy-link button.
 */
export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function currentUrl(): string {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function openShare(kind: "whatsapp" | "twitter" | "facebook") {
    const url = encodeURIComponent(currentUrl());
    const text = encodeURIComponent(title);
    const targets = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    window.open(targets[kind], "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      showToast("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Couldn't copy the link", "info");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-navy">Share:</span>
      <button
        onClick={() => openShare("whatsapp")}
        aria-label="Share on WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp text-white transition-colors hover:bg-whatsapp-hover"
      >
        <MessageCircle size={16} />
      </button>
      <button
        onClick={() => openShare("twitter")}
        aria-label="Share on X / Twitter"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-paper transition-opacity hover:opacity-90"
      >
        <XIcon size={14} />
      </button>
      <button
        onClick={() => openShare("facebook")}
        aria-label="Share on Facebook"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-facebook text-white transition-opacity hover:opacity-90"
      >
        <FacebookIcon size={15} />
      </button>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors hover:border-navy"
      >
        {copied ? <Check size={15} className="text-green" /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
