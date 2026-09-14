"use client";

import { useEffect, useRef } from "react";

type VideoData = {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
};

export default function VideoCard({
  video,
  isPlaying,
  hoverCapable,
  onPlay,
  onStop,
  cardRef
}: {
  video: VideoData;
  isPlaying: boolean;
  hoverCapable: boolean;
  onPlay: () => void;
  onStop: () => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.currentTime = 0;
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isPlaying]);

  function handleTap() {
    // On touch devices, scroll position drives playback automatically —
    // tapping is just a manual override in case someone wants to pause or
    // restart a specific card.
    if (hoverCapable) return;
    if (isPlaying) onStop();
    else onPlay();
  }

  return (
    <div
      ref={cardRef}
      data-video-id={video.id}
      onMouseEnter={hoverCapable ? onPlay : undefined}
      onMouseLeave={hoverCapable ? onStop : undefined}
      onClick={handleTap}
      className="group relative w-64 shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl border border-mist bg-paperdim transition-transform duration-300 hover:scale-[1.02] sm:w-72"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-ink/10">
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/70 text-paper transition-transform duration-300 group-hover:scale-110">
              ▶
            </div>
          </div>
        )}

        {video.durationSeconds != null && (
          <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-xs text-paper">
            {formatDuration(video.durationSeconds)}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-display text-base text-ink">{video.title}</p>
        {video.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ink/60">{video.description}</p>
        )}
      </div>
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
