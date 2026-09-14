"use client";

import { useEffect, useRef, useState } from "react";
import VideoCard from "@/components/VideoCard";

type VideoData = {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
};

export default function VideoShowcase({ videos }: { videos: VideoData[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [hoverCapable, setHoverCapable] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    setHoverCapable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  // On touch devices (no hover), auto-play whichever card is most visible
  // in the horizontal scroller — scrolling to the next card takes over
  // playback automatically, like a reel.
  useEffect(() => {
    if (hoverCapable) return;
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
          }
        }
        if (best) {
          const id = best.target.getAttribute("data-video-id");
          if (id) setPlayingId(id);
        }
      },
      { root, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    );

    cardEls.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [hoverCapable, videos]);

  if (videos.length === 0) return null;

  return (
    <section className="border-b border-mist bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl text-ink">See Our Kennel</h2>
        <p className="mt-2 max-w-prose text-ink/60">
          A quick look at daily life here — hover to watch, or scroll on mobile.
        </p>

        <div ref={scrollRef} className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isPlaying={playingId === video.id}
              hoverCapable={hoverCapable}
              onPlay={() => setPlayingId(video.id)}
              onStop={() => setPlayingId((current) => (current === video.id ? null : current))}
              cardRef={(el) => {
                if (el) cardEls.current.set(video.id, el);
                else cardEls.current.delete(video.id);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
