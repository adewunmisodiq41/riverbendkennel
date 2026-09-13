"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

const ACCEPTED = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];

export default function VideoFileUpload({
  initialUrl,
  initialDurationSeconds
}: {
  initialUrl?: string | null;
  initialDurationSeconds?: number | null;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [duration, setDuration] = useState<number | null>(initialDurationSeconds ?? null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function detectDuration(file: File): Promise<number | null> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(Number.isFinite(video.duration) ? Math.round(video.duration) : null);
      };
      video.onerror = () => resolve(null);
      video.src = URL.createObjectURL(file);
    });
  }

  async function uploadFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      setErrorMessage("Unsupported video format — use MP4, WebM, or MOV.");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setProgress(0);

    try {
      const detected = await detectDuration(file);
      if (detected) setDuration(detected);

      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload/video",
        onUploadProgress: ({ percentage }) => setProgress(percentage)
      });

      setUrl(blob.url);
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
      <label className="text-sm text-ink/70">Video file</label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-2 cursor-pointer border-2 border-dashed p-6 text-center text-sm transition-colors ${
          dragging ? "border-brass bg-brass/5" : "border-mist bg-white hover:border-brass/60"
        }`}
      >
        {status === "uploading" ? (
          <div>
            <p className="text-ink/70">Uploading… {progress}%</p>
            <div className="mx-auto mt-2 h-1.5 max-w-xs overflow-hidden bg-paperdim">
              <div className="h-full bg-brass transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : url ? (
          <div>
            <p className="text-ink/70">✓ Video uploaded{duration ? ` — ${formatDuration(duration)}` : ""}</p>
            <p className="mt-1 text-xs text-brass">Click or drop to replace</p>
          </div>
        ) : (
          <>
            <p className="text-ink/70">Drag a video here, or click to browse</p>
            <p className="mt-1 text-xs text-ink/40">MP4, WebM, or MOV — up to 500MB</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
        />
      </div>

      {status === "error" && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}

      <input type="hidden" name="videoUrl" value={url} />
      <input type="hidden" name="durationSeconds" value={duration ?? ""} />
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
