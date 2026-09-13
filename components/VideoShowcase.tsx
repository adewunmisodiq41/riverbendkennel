"use client";

import { useState } from "react";
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

  if (videos.length === 0) return null;

  return (
    <section className="border-b border-mist bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl text-ink">See Our Kennel</h2>
        <p className="mt-2 max-w-prose text-ink/60">
          A quick look at daily life here — hover to watch, or tap on mobile.
        </p>

        <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isPlaying={playingId === video.id}
              onPlay={() => setPlayingId(video.id)}
              onStop={() => setPlayingId((current) => (current === video.id ? null : current))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
