import React, { useState } from "react";
import Markdown from "./markdown";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are chatting with Google AI." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    });
    if (!res.body) {
      setLoading(false);
      return;
    }
    const reader = res.body.getReader();
    let aiMsg = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      aiMsg += new TextDecoder().decode(value);
      setMessages((msgs) => {
        // Replace last assistant message or add new
        if (msgs[msgs.length - 1]?.role === "assistant") {
          return [...msgs.slice(0, -1), { role: "assistant", content: aiMsg }];
        }
        return [...msgs, { role: "assistant", content: aiMsg }];
      });
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-4 space-y-2">
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "text-right" : "text-left"}
            >
              <div
                className={
                  m.role === "user"
                    ? "bg-blue-100 inline-block rounded px-3 py-2"
                    : "bg-gray-100 inline-block rounded px-3 py-2"
                }
              >
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          ))}
        {loading && (
          <div className="text-left">
            <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
