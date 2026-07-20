"use client";

import { useState, useRef } from "react";

interface ImageUploaderProps {
  onUploaded: (url: string) => void;
  currentImages?: string[];
}

export default function ImageUploader({ onUploaded, currentImages = [] }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("gmart_token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        onUploaded(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="text-xs text-muted block mb-1">Images</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {currentImages.map((url, i) => (
          <div key={i} className="relative w-16 h-16 bg-[#efefef] border border-line">
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="text-sm text-muted file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-[#efefef] file:text-ink hover:file:bg-line cursor-pointer"
      />
      {uploading && <p className="text-xs text-muted">Uploading...</p>}
    </div>
  );
}
