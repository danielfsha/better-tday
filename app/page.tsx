"use client";

import React, { useState } from "react";
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const uploadImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cloudflare-r2", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setUploadedFileUrl(data.url);
    } else {
      alert("Failed to upload file");
    }
  };
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black font-sans">
      {file && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Uploaded File:</h2>
          <ul className="flex flex-col gap-2">
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded"
              className="max-w-xs mt-2"
            />
            <li>{file.name}</li>
          </ul>
        </div>
      )}

      {uploadedFileUrl && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">File URL:</h2>
          <a
            href={uploadedFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {uploadedFileUrl}
          </a>
        </div>
      )}

      <form>
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button className="btn btn-primary mt-4" onClick={uploadImage}>
          Upload
        </button>
      </form>
    </div>
  );
}
