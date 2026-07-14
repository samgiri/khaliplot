export interface ChatMessageData {
  role: "user" | "bot";
  text: string;
}

export default function ChatMessage({ message }: { message: ChatMessageData }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-snug ${
          isUser ? "bg-navy text-paper" : "bg-paper-dim text-ink"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
