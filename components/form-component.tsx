import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";

import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  ArrowUDownLeftIcon,
  CaretRightIcon,
  FileIcon,
  PaperclipIcon,
  SwatchesIcon,
} from "@phosphor-icons/react";
import { PlusIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from "./ui/popover";

const FormComponent: React.FC = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isCompositionActive = useRef(false);
  useIsMobile();

  const [files, setFiles] = useState<File[]>([]);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(event.target.value);
    },
    [setInput],
  );

  const isAcceptedFile = useCallback(
    (file: File) =>
      [
        "image/",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].some((type) =>
        type === "image/" ? file.type.startsWith("image/") : file.type === type,
      ),
    [],
  );

  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      const filteredFiles = incomingFiles.filter(isAcceptedFile);

      setFiles((prevFiles) => {
        const existing = new Set(
          prevFiles.map(
            (file) => `${file.name}-${file.size}-${file.lastModified}`,
          ),
        );

        const uniqueFiles = filteredFiles.filter((file) => {
          const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
          if (existing.has(fileKey)) return false;
          existing.add(fileKey);
          return true;
        });

        return [...prevFiles, ...uniqueFiles];
      });
    },
    [isAcceptedFile],
  );

  const onDrop = useCallback(
    (acceptedDropFiles: File[]) => {
      addFiles(acceptedDropFiles);
    },
    [addFiles],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
  });

  const triggerFileInput = useCallback(() => {
    open();
  }, [open]);

  return (
    <div
      {...getRootProps({
        className: cn(
          "w-full max-w-137.5 rounded-lg bg-gray-300 p-0 flex flex-col overflow-hidden gap-1 relative",
        ),
      })}
    >
      <input {...getInputProps()} />

      {isDragActive && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-orange-500/20 text-orange-600 bg-blur-sm rounded-lg border border-dashed border-orange-500">
          <span className="text-sm font-sans">Drop files here</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-row gap-2 p-2">
          {files.map((file, index) => (
            <div
              key={index}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              className="relative w-32 h-32 rounded-md bg-gray-200 overflow-hidden flex"
            >
              {/* x button */}
              <Button
                variant="secondary"
                size="icon-lg"
                onClick={() =>
                  setFiles((prevFiles) =>
                    prevFiles.filter((_, i) => i !== index),
                  )
                }
                className="absolute right-1 top-1 z-10 size-6 rounded-full bg-gray-700 hover:bg-gray-700 text-white"
                tabIndex={-1}
              >
                &times;
              </Button>

              {file.type.startsWith("image/") ? (
                <Image
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  unoptimized
                  fill
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full rounded-sm bg-white">
                  <FileIcon size={32} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Textarea
        ref={inputRef}
        placeholder="Ask a follow-up..."
        value={input}
        onChange={handleInput}
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
      />
      <div className="flex items-center justify-between p-1">
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" size="icon-lg">
              <PlusIcon size={26} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className={"gap-0 p-1"}>
            <div className="flex items-center justify-betweeen w-full hover:bg-gray-300 p-1 py-1.5 rounded-sm cursor-pointer">
              <div
                onClick={triggerFileInput}
                className="flex items-center justify-start gap-4 flex-1"
              >
                <PaperclipIcon weight="regular" size={20} />
                <PopoverDescription>
                  Upload image form device
                </PopoverDescription>
              </div>
              {/* <CaretRightIcon /> */}
            </div>
            <div className="flex items-center justify-betweeen w-full hover:bg-gray-300 p-1 py-1.5 rounded-sm cursor-pointer">
              <div className="flex items-center justify-start gap-4 flex-1">
                <SwatchesIcon weight="fill" size={20} />
                <PopoverDescription>Extract brand guide.</PopoverDescription>
              </div>
              <CaretRightIcon />
            </div>
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
