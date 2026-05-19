"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FormComponent from "@/components/form-component";
import MarkdownRenderer from "@/components/markdown";

export default function ChatInterface() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    stop,
    error,
    regenerate,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      // Example: handle a client-side tool
      if (toolCall.toolName === "getLocation") {
        const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
        addToolOutput({
          tool: "getLocation",
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)],
        });
      }
    },
  });

  // Helper to generate a unique chat session id
  function generateChatId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  // Handler for sending a message and redirecting
  function handleSend(text: string) {
    if (!text.trim()) return;
    const id = generateChatId();
    router.push(`/new/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-4">
      <div className="flex-1 min-h-[300px] mb-2 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="text-left">
            <MarkdownRenderer
              content={message.parts
                .map((p) =>
                  p.type === "text"
                    ? p.text
                    : p.type === "file" && p.mediaType?.startsWith("image/")
                      ? `![${p.filename || "image"}](${p.url})`
                      : "",
                )
                .join("\n\n")}
              isUserMessage={message.role === "user"}
            />
          </div>
        ))}
        {(status === "submitted" || status === "streaming") && (
          <div className="text-left">
            <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-red-600">
            An error occurred. <button onClick={regenerate}>Retry</button>
          </div>
        )}
      </div>
      {/* Custom input for Ctrl+Enter and Send button */}
      <div className="flex gap-2 mt-2">
        <input
          ref={inputRef}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              const value = (e.target as HTMLInputElement).value;
              if (value.trim()) handleSend(value);
            }
          }}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={(e) => {
            e.preventDefault();
            const value = inputRef.current?.value || "";
            if (value.trim()) {
              handleSend(value);
              if (inputRef.current) inputRef.current.value = "";
            }
          }}
        >
          Send
        </button>
      </div>
      {/* Optionally keep FormComponent for file/image upload below */}
      <FormComponent onSend={value => {
        if (value.trim()) handleSend(value);
      }} />
    </div>
  );
}
