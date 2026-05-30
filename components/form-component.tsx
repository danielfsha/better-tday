import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";

import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  ArrowUDownLeftIcon,
  CaretRightIcon,
  FileIcon,
  ImageIcon,
  PaperclipIcon,
  SwatchesIcon,
  VideoIcon,
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
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100

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

  // Only allow one image at a time
  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      const filteredFiles = incomingFiles
        .filter(isAcceptedFile)
        .filter((f) => f.type.startsWith("image/"));
      if (filteredFiles.length === 0) return;
      const file = filteredFiles[0];
      setFiles([file]);
      setFileUrls((prevUrls) => {
        // Clean up old URLs
        Object.values(prevUrls).forEach((url) => URL.revokeObjectURL(url));
        const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
        return { [fileKey]: URL.createObjectURL(file) };
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
    multiple: false,
    accept: { "image/*": [] },
  });

  const triggerFileInput = useCallback(() => {
    open();
  }, [open]);

  const removeFile = useCallback(() => {
    // If uploaded, delete from Cloudflare R2
    const uploadedUrl = fileUrls.uploaded;
    if (uploadedUrl) {
      fetch("/api/cloudflare-r2", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadedUrl }),
      });
    }
    setFiles([]);
    setFileUrls((prevUrls) => {
      Object.values(prevUrls).forEach((url) => URL.revokeObjectURL(url));
      return {};
    });
    setUploading(false);
    setUploadProgress(0);
  }, [fileUrls]);

  // Clean up all URLs on unmount
  React.useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  // Real upload logic: upload to /api/cloudflare-r2 when a file is dropped
  React.useEffect(() => {
    const uploadImage = async (file: File) => {
      setUploading(true);
      setUploadProgress(0);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/cloudflare-r2");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          setUploading(false);
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.url) {
                // Replace preview with public URL
                setFileUrls((prevUrls) => {
                  Object.values(prevUrls).forEach((url) =>
                    URL.revokeObjectURL(url),
                  );
                  return { uploaded: data.url };
                });
              }
            } catch {}
          } else {
            // Error
            setFiles([]);
            setFileUrls((prevUrls) => {
              Object.values(prevUrls).forEach((url) =>
                URL.revokeObjectURL(url),
              );
              return {};
            });
            alert("Upload failed: " + (xhr.responseText || xhr.statusText));
          }
        };

        xhr.onerror = () => {
          setUploading(false);
          setFiles([]);
          setFileUrls((prevUrls) => {
            Object.values(prevUrls).forEach((url) => URL.revokeObjectURL(url));
            return {};
          });
          alert("Upload failed: network error");
        };

        xhr.send(formData);
      } catch (e) {
        setUploading(false);
        setFiles([]);
        setFileUrls((prevUrls) => {
          Object.values(prevUrls).forEach((url) => URL.revokeObjectURL(url));
          return {};
        });
        alert(
          "Upload failed: " +
            (e instanceof Error ? e.message : "Unknown error"),
        );
      }
    };

    if (files.length === 1 && !uploading) {
      uploadImage(files[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div
      {...getRootProps({
        className: cn(
          "w-full max-w-137.5 rounded-lg bg-gray-100 p-0 flex flex-col overflow-hidden gap-1 relative",
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
          <div
            key={0}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className="relative w-32 h-32 rounded-md bg-gray-200 overflow-hidden flex"
          >
            {/* x button */}
            <Button
              variant="secondary"
              size="icon-lg"
              onClick={removeFile}
              className="absolute right-1 top-1 z-10 size-6 rounded-full bg-gray-700 hover:bg-gray-700 text-white"
              tabIndex={-1}
            >
              &times;
            </Button>

            {(() => {
              // If upload complete and we have a public URL, use it
              const url = fileUrls.uploaded || Object.values(fileUrls)[0];
              if (url) {
                return (
                  <Image
                    draggable={false}
                    onDragStart={(event) => event.preventDefault()}
                    src={url}
                    alt={files[0].name}
                    unoptimized
                    fill
                    className="object-cover w-full h-full"
                  />
                );
              }
              return (
                <div className="flex items-center justify-center w-full h-full rounded-sm bg-white">
                  <FileIcon size={32} />
                </div>
              );
            })()}

            {/* Animated overlay for uploading */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
        style={{ maxHeight: "6.6em", overflowY: "auto" }}
        autoFocus
        onKeyDown={(e) => {
          // Prevent adding more than 3 lines
          const lineCount = (input.match(/\n/g)?.length ?? 0) + 1;
          if (e.key === "Enter" && !e.shiftKey && lineCount >= 3) {
            e.preventDefault();
          }
        }}
        onCompositionStart={() => {
          isCompositionActive.current = true;
        }}
        onCompositionEnd={() => {
          isCompositionActive.current = false;
        }}
      />
      <div className="flex items-center justify-between p-1">
        <div className="flex items-center gap-1">
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
          <div className="flex items-center p-0.5 bg-white rounded-lg bg-gray-200 cursor-pointer">
            <Button variant="outline" className="bg-white py-0.5">
              <ImageIcon size={26} weight="fill" />
              Image
            </Button>
            <Button variant="ghost" className="hover:bg-transparent py-1">
              <VideoIcon size={26} weight="fill" />
              Video
            </Button>
          </div>
        </div>

        <Button variant="ghost" size="icon-lg">
          <ArrowUDownLeftIcon size={26} />
        </Button>
      </div>
    </div>
  );
};

export default FormComponent;
