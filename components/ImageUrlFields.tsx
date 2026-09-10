"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import Image from "next/image";

type Row = {
  url: string;
  altText: string;
  status: "done" | "uploading" | "error";
};

export default function ImageUrlFields({
  initial
}: {
  initial?: { url: string; altText?: string | null }[];
}) {
  const [rows, setRows] = useState<Row[]>(
    initial && initial.length > 0
      ? initial.map((i) => ({ url: i.url, altText: i.altText ?? "", status: "done" as const }))
      : []
  );
  const [dragging, setDragging] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;

    const startIndex = rows.length;
    setRows((prev) => [
      ...prev,
      ...list.map((f) => ({ url: "", altText: f.name.replace(/\.[^.]+$/, ""), status: "uploading" as const }))
    ]);

    await Promise.all(
      list.map(async (file, i) => {
        const rowIndex = startIndex + i;
        try {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload"
          });
          setRows((prev) =>
            prev.map((r, idx) => (idx === rowIndex ? { ...r, url: blob.url, status: "done" } : r))
          );
        } catch {
          setRows((prev) => prev.map((r, idx) => (idx === rowIndex ? { ...r, status: "error" } : r)));
        }
      })
    );
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  function updateAlt(index: number, value: string) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, altText: value } : r)));
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function addManualRow() {
    setRows((prev) => [...prev, { url: "", altText: "", status: "done" }]);
    setManualOpen(true);
  }

  function updateManualUrl(index: number, value: string) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, url: value } : r)));
  }

  return (
    <div className="space-y-4">
      <label className="text-sm text-ink/70">Photos</label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed p-8 text-center text-sm transition-colors ${
          dragging ? "border-brass bg-brass/5" : "border-mist bg-white hover:border-brass/60"
        }`}
      >
        <p className="text-ink/70">Drag photos here, or click to browse</p>
        <p className="mt-1 text-xs text-ink/40">JPG, PNG, WEBP, or GIF — up to 15MB each</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {/* Uploaded / manual rows */}
      {rows.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rows.map((row, i) => (
            <div key={i} className="relative border border-mist bg-white p-2">
              <div className="aspect-square overflow-hidden bg-paperdim">
                {row.status === "uploading" && (
                  <div className="flex h-full items-center justify-center text-xs text-ink/40">
                    Uploading…
                  </div>
                )}
                {row.status === "error" && (
                  <div className="flex h-full items-center justify-center text-xs text-red-600">
                    Failed
                  </div>
                )}
                {row.status === "done" &&
                  (row.url ? (
                    <Image src={row.url} alt="" width={200} height={200} className="h-full w-full object-cover" />
                  ) : manualOpen ? (
                    <input
                      type="url"
                      placeholder="Paste image URL…"
                      onChange={(e) => updateManualUrl(i, e.target.value)}
                      className="h-full w-full px-2 text-xs"
                    />
                  ) : null)}
              </div>
              <input
                type="text"
                name="imageUrl"
                value={row.url}
                readOnly
                hidden
              />
              <input
                type="text"
                name="imageAlt"
                placeholder="Description"
                value={row.altText}
                onChange={(e) => updateAlt(i, e.target.value)}
                className="mt-2 w-full border border-mist px-2 py-1 text-xs text-ink focus:border-brass"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center bg-ink text-xs text-paper hover:bg-red-600"
                aria-label="Remove photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={addManualRow} className="text-xs text-brass hover:text-brasslight">
        + Paste an image URL instead
      </button>
    </div>
  );
}
