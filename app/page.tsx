"use client";

import { AnimatedMaskRevealText } from "@/components/animated-mask-reveal-text";
import { AnimatedText } from "@/components/animated-text";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import React, { useState } from "react";

export default function Home() {
  const [value, setValue] = useState(25);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [segments, setSegments] = useState<[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSegmenting, setIsSegmenting] = useState(false);

  const uploadImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    setSegments(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cloudflare-r2", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setIsUploading(false);

    if (response.ok) {
      setUploadedFileUrl(data.url);
    } else {
      alert("Upload failed");
    }
  };

  const segmentImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!uploadedFileUrl) return;
    setIsSegmenting(true);
    setSegments(null);
  };

  // useEffect(() => {
  //   // randomly genete numbers between 0 and 100 every 2 seconds to test the animated text component
  //   const interval = setInterval(() => {
  //     setValue(Math.floor(Math.random() * 101));
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div style={{ padding: 16 }} className="flex flex-col items-start gap-4">
      <div className="font-mono text-6xl tabular-nums ">
        <AnimatedText value={String(value)} />
      </div>

      <Switch />

      <Slider text="Radius" value={value} onValueChange={setValue} />

      <AnimatedMaskRevealText
        text={"What would you like\n to design tday?"}
        className="text-4xl lg:text-6xl mx-auto font-serif"
      />

      <form
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setFile(f);
            setPreviewUrl(f ? URL.createObjectURL(f) : null);
            setUploadedFileUrl(null);
            setSegments(null);
          }}
        />
        <button onClick={uploadImage} disabled={!file || isUploading}>
          {isUploading ? "Uploading\u2026" : "Upload"}
        </button>
        {uploadedFileUrl && (
          <button onClick={segmentImage} disabled={isSegmenting}>
            {isSegmenting ? "Segmenting\u2026" : "Segment"}
          </button>
        )}
      </form>

      {previewUrl && !segments && (
        <img src={previewUrl} alt="preview" style={{ maxHeight: 300 }} />
      )}
    </div>
  );
}
