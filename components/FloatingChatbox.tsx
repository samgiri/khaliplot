"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import ChatMessage, { type ChatMessageData } from "@/components/ChatMessage";
import {
  CHATBOT_GREETING,
  WHATSAPP_NUDGE_TEXT,
  WHATSAPP_URL,
  getBotReply,
} from "@/lib/chatbot-service";

function playNotificationSound() {
  const audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {
    // Fallback: synthesize the ding if the file can't play (e.g. blocked codec)
    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      osc.onended = () => ctx.close();
    } catch {
      // Sound is best-effort; never break the chat over it.
    }
  });
}

function saveToInquiries(message: string, reply: string) {
  fetch("/api/chatbox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, reply }),
  }).catch(() => {
    // Best-effort logging; the visitor already has their answer.
  });
}

export default function FloatingChatbox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([
    { role: "bot", text: CHATBOT_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [userMessageCount, setUserMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const reply = getBotReply(text);
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "bot", text: reply },
    ]);
    setUserMessageCount((count) => count + 1);
    setInput("");
    playNotificationSound();
    saveToInquiries(text, reply);
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="KhaliPlot Assistant chat"
          className="fixed bottom-24 right-4 z-50 flex h-[400px] w-[90vw] max-w-[300px] flex-col overflow-hidden rounded-xl border-2 border-navy bg-white shadow-xl sm:right-6"
        >
          <div className="flex items-center justify-between bg-navy px-4 py-3">
            <p className="font-display font-bold text-paper">KhaliPlot Assistant</p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-paper/80 transition-colors hover:text-paper"
            >
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.map((message, i) => (
              <ChatMessage key={i} message={message} />
            ))}
            {userMessageCount >= 2 && (
              <div className="rounded-lg border border-line bg-green-pale p-3 text-center">
                <p className="text-sm font-semibold text-navy">{WHATSAPP_NUDGE_TEXT}</p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-whatsapp px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-whatsapp-hover"
                >
                  <MessageCircle size={15} /> Open WhatsApp
                </a>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-line p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Type a message…"
              aria-label="Chat message"
              className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-green-bright"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber text-navy transition-colors hover:bg-amber-dark"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close KhaliPlot Assistant" : "Open KhaliPlot Assistant"}
        className="fixed bottom-4 right-4 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-amber text-3xl shadow-lg transition-colors hover:bg-amber-dark sm:right-6"
      >
        <span aria-hidden="true">💬</span>
      </button>
    </>
  );
}
