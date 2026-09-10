"use client";

import { useState } from "react";
import Image from "next/image";

export default function PhotoGallery({
  images,
  alt
}: {
  images: { url: string; altText?: string | null }[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-paperdim text-sm text-ink/40">
        Photos coming soon
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden bg-paperdim">
        <Image
          src={images[active].url}
          alt={images[active].altText ?? alt}
          width={800}
          height={600}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden border-2 ${
                i === active ? "border-brass" : "border-transparent"
              }`}
              aria-label={`Show photo ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? alt}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
