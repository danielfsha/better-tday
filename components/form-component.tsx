/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef } from "react";
import { sileo } from "sileo";

import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { Attachment, ChatMessage } from "@/types";

type FormMessagePart =
  | {
      type: "file";
      url: string;
      name: string;
      mediaType: string;
    }
  | {
      type: "text";
      text: string;
    };

interface FormComponentProps {
  input: string;
  setInput: (input: string) => void;
  attachments: Attachment[];
  clearAttachments: () => void;
  chatId: string;
  user: { id?: string } | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  messages: ChatMessage[];
  sendMessage: (message: {
    role: "user";
    parts: FormMessagePart[];
  }) => void | Promise<void>;
  resetSuggestedQuestions: () => void;
  lastSubmittedQueryRef: React.RefObject<string>;
  status: string;
  setHasSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  isLimitBlocked?: boolean;
  isTemporaryChatEnabled: boolean;
  onBeforeSubmit?: () => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  chatId,
  user,
  input,
  setInput,
  attachments,
  clearAttachments,
  sendMessage,
  fileInputRef,
  inputRef,
  resetSuggestedQuestions,
  lastSubmittedQueryRef,
  messages,
  status,
  setHasSubmitted,
  isLimitBlocked = false,
  isTemporaryChatEnabled,
  onBeforeSubmit,
}) => {
  const resizeRafRef = useRef<number>(0);
  const isCompositionActive = useRef(false);
  const isMounted = useRef(true);
  const isMobile = useIsMobile();
  const hasInteracted = messages.length > 0;

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(event.target.value);
    },
    [setInput],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter" || isCompositionActive.current) {
        return;
      }

      if (isMobile || event.shiftKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    },
    [isMobile],
  );

  const handleTextareaFocus = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      const textarea = event.target;
      if (
        textarea.value.length > 0 &&
        textarea.selectionStart === 0 &&
        textarea.selectionEnd === 0
      ) {
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }
    },
    [],
  );

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      cancelAnimationFrame(resizeRafRef.current);
    };
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.closest('[contenteditable="true"]')
      ) {
        return;
      }

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.key.length !== 1
      ) {
        return;
      }

      if (!inputRef.current || document.activeElement === inputRef.current) {
        return;
      }

      if (event.key === " " && input.length === 0) {
        return;
      }

      const nextValue = `${input}${event.key}`;
      setInput(nextValue);
      inputRef.current.focus();
      event.preventDefault();

      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(nextValue.length, nextValue.length);
      });
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [input, inputRef, setInput]);

  return (
    <div className="bg-gray-300">
      <Textarea
        ref={inputRef}
        placeholder={hasInteracted ? "Ask a follow-up..." : ""}
        value={input}
        onChange={handleInput}
        onFocus={handleTextareaFocus}
        className={cn(
          "w-full text-[16px]! bg-transparent",
          "leading-normal",
          "text-foreground!",
          "min-h-0!",
          "px-4! py-3.5!",
          "focus:border-none focus:ring-0 focus:ring-offset-0",
        )}
        rows={1}
        autoFocus
        onCompositionStart={() => {
          isCompositionActive.current = true;
        }}
        onCompositionEnd={() => {
          isCompositionActive.current = false;
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default FormComponent;
