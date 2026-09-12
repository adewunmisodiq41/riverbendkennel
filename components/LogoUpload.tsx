"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function LogoUpload({ initialUrl }: { initialUrl?: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setStatus("uploading");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setUrl(data.url);
      setStatus("idle");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Upload failed.");
      setStatus("error");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div>
      <label className="text-sm text-ink/70">Logo (used as the site icon and in the header)</label>

      <div className="mt-2 flex items-center gap-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center border-2 border-dashed text-center text-xs ${
            dragging ? "border-brass bg-brass/5" : "border-mist bg-white hover:border-brass/60"
          }`}
        >
          {status === "uploading" ? (
            <span className="text-ink/40">Uploading…</span>
          ) : url ? (
            <Image src={url} alt="Logo" width={96} height={96} className="h-full w-full object-contain p-2" />
          ) : (
            <span className="text-ink/40">Drop or click</span>
          )}
        </div>

        <div className="text-sm">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-brass hover:text-brasslight"
          >
            {url ? "Replace logo" : "Upload a logo"}
          </button>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="ml-4 text-ink/40 hover:text-red-600">
              Remove
            </button>
          )}
          {status === "error" && <p className="mt-1 text-red-600">{errorMessage}</p>}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
      />
      <input type="hidden" name="logoUrl" value={url} />
    </div>
  );
}
