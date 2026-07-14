// Rule-based MVP assistant for the floating chatbox. Keyword rules are
// checked in order; "sell"/"listing" runs before "buy"/"plot" so that
// "I want to sell my plot" doesn't get caught by the plot-buying rule.

export const WHATSAPP_URL = "https://wa.me/919625763256";

export const CHATBOT_GREETING =
  "Hi! I'm the KhaliPlot Assistant 👋 Ask me about buying, selling, pricing or our packages.";

export const WHATSAPP_NUDGE_TEXT = "Chat faster on WhatsApp?";

interface ChatRule {
  keywords: string[];
  reply: string;
}

const rules: ChatRule[] = [
  {
    keywords: ["price"],
    reply:
      "💡 Try our AI Price Suggestion! When you view or post a plot, KhaliPlot's AI suggests a fair market price and scores listings based on price. Want to see it in action? Browse plots at khaliplot.in/search.",
  },
  {
    keywords: ["sell", "listing"],
    reply:
      "📤 Great — you can list your plot free in about 5 minutes on our Sell Plot page. Head to khaliplot.in/post-plot to get started, and our AI will even suggest a price for it.",
  },
  {
    keywords: ["buy", "plot"],
    reply:
      "🏞️ Happy to help you find a plot! Which city are you looking in, and what's your budget? You can also browse all verified plots at khaliplot.in/search.",
  },
  {
    keywords: ["package"],
    reply:
      "📦 Our packages: Free (₹0, 1 contact reveal/month), Plus (from ₹999, unlimited reveals + verified badge), Reveal Pack (₹499, 10 reveals) and Booster (₹499, pin your listing for 7 days). Full details at khaliplot.in/pricing.",
  },
];

const DEFAULT_REPLY = "I can help! Want to chat on WhatsApp instead? 💬";

export function getBotReply(userMessage: string): string {
  const text = userMessage.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.reply;
    }
  }
  return DEFAULT_REPLY;
}
