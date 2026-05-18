"use client";

import { AnimatedMaskRevealText } from "@/components/animated-mask-reveal-text";
import AppSidebar from "@/components/app-sidebar";
import FormComponent from "@/components/form-component";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useRef, useState } from "react";
import type { Attachment } from "@/types";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastSubmittedQueryRef = useRef("");
  const chatId = useRef(
    typeof crypto !== "undefined"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
  ).current;

  const clearAttachments = () => setAttachments([]);
  const resetSuggestedQuestions = () => {};
  const sendMessage = async (message: {
    role: "user";
    parts: { type: string; [key: string]: unknown }[];
  }) => {
    // TODO: wire up to chat
    console.log("sendMessage", message);
  };

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 px-4 border-b">
          <SidebarTrigger />
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-16">
          <div className="flex flex-col items-center gap-3 text-center">
            <AnimatedMaskRevealText
              text={"What would you like\nto design tday?"}
              className="text-4xl lg:text-6xl font-serif"
            />
            <p className="text-muted-foreground text-base lg:text-lg max-w-md">
              Describe what you want to build and let AI bring it to life.
            </p>
          </div>

          <div className="w-full max-w-2xl rounded-2xl border bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/40 transition-shadow overflow-hidden">
            <FormComponent
              chatId={chatId}
              user={null}
              input={input}
              setInput={setInput}
              attachments={attachments}
              clearAttachments={clearAttachments}
              fileInputRef={fileInputRef as never}
              inputRef={inputRef as never}
              messages={[]}
              sendMessage={sendMessage as never}
              resetSuggestedQuestions={resetSuggestedQuestions}
              lastSubmittedQueryRef={lastSubmittedQueryRef}
              status="ready"
              setHasSubmitted={setHasSubmitted}
              isTemporaryChatEnabled={false}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
            {[
              "Landing page for a SaaS",
              "Mobile app onboarding",
              "Dashboard with dark mode",
              "E-commerce product card",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setInput(suggestion);
                  inputRef.current?.focus();
                }}
                className="rounded-full border px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
