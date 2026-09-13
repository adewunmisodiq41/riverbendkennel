"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

const ACCEPTED = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];

export default function VideoFileUpload({
  initialUrl,
  initialThumbnailUrl,
  initialDurationSeconds
}: {
  initialUrl?: string | null;
  initialThumbnailUrl?: string | null;
  initialDurationSeconds?: number | null;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl ?? "");
  const [duration, setDuration] = useState<number | null>(initialDurationSeconds ?? null);
  const [status, setStatus] = useState<"idle" | "processing" | "uploading" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Reads the video's own metadata and grabs a real frame as a JPEG, so
  // there's always a genuine static image to show as a poster — some
  // mobile browsers won't render a video's own first frame automatically
  // the way desktop browsers do, so a real uploaded image is required for
  // this to look right everywhere.
  function captureFrame(file: File): Promise<{ duration: number | null; frameBlob: Blob | null }> {
    return new Promise((resolve) => {
      const videoEl = document.createElement("video");
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.preload = "auto";
      const objectUrl = URL.createObjectURL(file);
      videoEl.src = objectUrl;

      let settled = false;
      const finish = (result: { duration: number | null; frameBlob: Blob | null }) => {
        if (settled) return;
        settled = true;
        URL.revokeObjectURL(objectUrl);
        resolve(result);
      };

      videoEl.onloadedmetadata = () => {
        const dur = Number.isFinite(videoEl.duration) ? Math.round(videoEl.duration) : null;
        const seekTo = Math.min(1, videoEl.duration / 2 || 0);
        videoEl.currentTime = seekTo;

        videoEl.onseeked = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = videoEl.videoWidth || 640;
            canvas.height = videoEl.videoHeight || 360;
            const ctx = canvas.getContext("2d");
            if (!ctx) return finish({ duration: dur, frameBlob: null });
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => finish({ duration: dur, frameBlob: blob }), "image/jpeg", 0.85);
          } catch {
            finish({ duration: dur, frameBlob: null });
          }
        };
      };

      videoEl.onerror = () => finish({ duration: null, frameBlob: null });
      // Safety timeout in case metadata/seek events never fire.
      setTimeout(() => finish({ duration: null, frameBlob: null }), 8000);
    });
  }

  async function uploadThumbnailBlob(blob: Blob) {
    const body = new FormData();
    body.append("file", new File([blob], "thumbnail.jpg", { type: "image/jpeg" }));
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Thumbnail upload failed.");
    return data.url as string;
  }

  async function uploadFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      setErrorMessage("Unsupported video format — use MP4, WebM, or MOV.");
      setStatus("error");
      return;
    }

    setStatus("processing");
    setProgress(0);

    try {
      const { duration: detectedDuration, frameBlob } = await captureFrame(file);
      if (detectedDuration) setDuration(detectedDuration);

      if (frameBlob) {
        try {
          const thumbUrl = await uploadThumbnailBlob(frameBlob);
          setThumbnailUrl(thumbUrl);
        } catch {
          // Non-fatal — the video itself still uploads even if the
          // auto-thumbnail fails; admin can add one manually below.
        }
      }

      setStatus("uploading");
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

  async function uploadManualThumbnail(file: File) {
    if (!file.type.startsWith("image/")) return;
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setThumbnailUrl(data.url);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Thumbnail upload failed.");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  const busy = status === "processing" || status === "uploading";

  return (
    <div className="space-y-4">
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
          {status === "processing" && <p className="text-ink/70">Reading video…</p>}
          {status === "uploading" && (
            <div>
              <p className="text-ink/70">Uploading… {progress}%</p>
              <div className="mx-auto mt-2 h-1.5 max-w-xs overflow-hidden bg-paperdim">
                <div className="h-full bg-brass transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          {!busy && url && (
            <div>
              <p className="text-ink/70">✓ Video uploaded{duration ? ` — ${formatDuration(duration)}` : ""}</p>
              <p className="mt-1 text-xs text-brass">Click or drop to replace</p>
            </div>
          )}
          {!busy && !url && (
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
      </div>

      <div>
        <label className="text-sm text-ink/70">
          Thumbnail {thumbnailUrl ? "(auto-generated from the video — you can replace it)" : ""}
        </label>
        <div className="mt-2 flex items-center gap-4">
          <div
            onClick={() => thumbInputRef.current?.click()}
            className="flex h-20 w-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-mist bg-white hover:border-brass/60"
          >
            {thumbnailUrl ? (
              <Image src={thumbnailUrl} alt="" width={128} height={80} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-ink/40">No thumbnail yet</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => thumbInputRef.current?.click()}
            className="text-sm text-brass hover:text-brasslight"
          >
            {thumbnailUrl ? "Replace thumbnail" : "Upload a thumbnail"}
          </button>
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadManualThumbnail(e.target.files[0])}
          />
        </div>
      </div>

      <input type="hidden" name="videoUrl" value={url} />
      <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
      <input type="hidden" name="durationSeconds" value={duration ?? ""} />
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
