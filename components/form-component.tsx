import React, { useCallback, useEffect, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ArrowUDownLeftIcon } from "@phosphor-icons/react";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./ui/popover";

const FormComponent: React.FC = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isCompositionActive = useRef(false);
  const isMounted = useRef(true);
  const isMobile = useIsMobile();

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
    <div className="border-none bg-gray-300 p-0 w-full max-w-[550px] rounded-lg flex flex-col overflow-hidden gap-1">
      <Textarea
        ref={inputRef}
        placeholder="Ask a follow-up..."
        value={input}
        onChange={handleInput}
        onFocus={handleTextareaFocus}
        className={cn(
          "font-sans min-h-11 resize-none border-none bg-transparent px-4 py-3 shadow-none outline-none focus-visible:ring-0 text-md",
          "active:border-none focus:border-none",
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
      <div className="flex items-center justify-between p-1">
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" size="icon-lg">
              <PlusIcon size={26} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>Title</PopoverTitle>
              <PopoverDescription>Description text here.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon-lg">
          <ArrowUDownLeftIcon size={26} />
        </Button>
      </div>
    </div>
  );
};

export default FormComponent;
