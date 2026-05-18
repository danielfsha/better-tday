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

  const resizeTextarea = useCallback(() => {
    if (!inputRef.current) return;

    const target = inputRef.current;
    const maxHeight = 300;
    const previousWindowScroll = window.scrollY;
    const previousTextareaScroll = target.scrollTop;

    target.style.height = "auto";

    if (target.scrollHeight > maxHeight) {
      target.style.height = `${maxHeight}px`;
      target.style.overflowY = "auto";
    } else {
      target.style.height = `${target.scrollHeight}px`;
      target.style.overflowY = "hidden";
    }

    window.scrollTo({ top: previousWindowScroll });
    target.scrollTop = previousTextareaScroll;

    if (target.selectionStart === target.value.length) {
      target.scrollTop = target.scrollHeight;
    }
  }, [inputRef]);

  const updateChatUrl = useCallback(
    (chatIdToAdd: string) => {
      if (!user) return;

      const currentPath = window.location.pathname;
      if (currentPath === "/" || currentPath === "/new") {
        window.history.pushState({}, "", `/search/${chatIdToAdd}`);
      }
    },
    [user],
  );

  const submitForm = useCallback(() => {
    if (status !== "ready") {
      sileo.error({
        title: "Please wait for the current response to complete",
        description: "Wait for the current message to finish",
      });
      return;
    }

    if (isLimitBlocked) {
      sileo.error({
        title: "Daily search limit reached",
        description: "Upgrade to continue searching",
      });
      return;
    }

    if (!input.trim() && attachments.length === 0) {
      sileo.error({ title: "Please enter a search query or attach a file." });
      return;
    }

    onBeforeSubmit?.();
    setHasSubmitted(true);
    lastSubmittedQueryRef.current = input.trim();

    if (!isTemporaryChatEnabled) {
      updateChatUrl(chatId);
    }

    void sendMessage({
      role: "user",
      parts: [
        ...attachments.map((attachment) => ({
          type: "file" as const,
          url: attachment.url,
          name: attachment.name,
          mediaType: attachment.contentType || attachment.mediaType || "",
        })),
        {
          type: "text" as const,
          text: input,
        },
      ],
    });

    setInput("");
    clearAttachments();
    resetSuggestedQuestions();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.overflowY = "hidden";
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  }, [
    attachments,
    chatId,
    fileInputRef,
    input,
    inputRef,
    isLimitBlocked,
    isTemporaryChatEnabled,
    lastSubmittedQueryRef,
    onBeforeSubmit,
    resetSuggestedQuestions,
    sendMessage,
    clearAttachments,
    setHasSubmitted,
    setInput,
    status,
    updateChatUrl,
  ]);

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
      submitForm();
    },
    [isMobile, submitForm],
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

  useEffect(() => {
    cancelAnimationFrame(resizeRafRef.current);
    resizeRafRef.current = requestAnimationFrame(resizeTextarea);
    return () => cancelAnimationFrame(resizeRafRef.current);
  }, [input, resizeTextarea]);

  useEffect(() => {
    if (status !== "ready" && inputRef.current && isMounted.current) {
      const focusTimeout = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 300);

      return () => clearTimeout(focusTimeout);
    }
  }, [inputRef, status]);

  return (
    <div>
      <Textarea
        ref={inputRef}
        placeholder={hasInteracted ? "Ask a follow-up..." : ""}
        value={input}
        onChange={handleInput}
        onFocus={handleTextareaFocus}
        onInput={resizeTextarea}
        className={cn(
          "w-full rounded-xl rounded-b-none text-[16px]!",
          "leading-normal",
          "border-0!",
          "text-foreground!",
          "focus:ring-0! focus-visible:ring-0!",
          "min-h-0!",
          "px-4! py-3.5!",
          "touch-manipulation",
          "whatsize!",
          "shadow-none!",
          "transition-colors duration-200",
          !input && !hasInteracted ? "bg-transparent!" : "bg-muted!",
        )}
        style={{
          WebkitUserSelect: "text",
          WebkitTouchCallout: "none",
          minHeight: undefined,
          resize: "none",
        }}
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
