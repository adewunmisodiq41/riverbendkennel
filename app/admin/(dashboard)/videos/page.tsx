import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteVideo, moveVideo } from "@/lib/actions/videos";
import VideoActiveToggle from "@/components/VideoActiveToggle";

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Featured videos</h1>
          <p className="mt-1 text-sm text-ink/60">
            Order here matches the order visitors see on the homepage.
          </p>
        </div>
        <Link href="/admin/videos/new" className="bg-pine px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink">
          Add a video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-center text-sm text-ink/60">
          No videos yet.{" "}
          <Link href="/admin/videos/new" className="text-brass hover:text-brasslight">
            Add your first one
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-mist bg-paper">
          {videos.map((video, i) => (
            <li key={video.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex flex-col gap-1">
                <form action={moveVideo.bind(null, video.id, "up")}>
                  <button
                    type="submit"
                    disabled={i === 0}
                    className="text-ink/40 hover:text-brass disabled:opacity-20"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                </form>
                <form action={moveVideo.bind(null, video.id, "down")}>
                  <button
                    type="submit"
                    disabled={i === videos.length - 1}
                    className="text-ink/40 hover:text-brass disabled:opacity-20"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </form>
              </div>

              <div className="h-14 w-20 shrink-0 overflow-hidden bg-paperdim">
                {video.thumbnailUrl && (
                  <Image
                    src={video.thumbnailUrl}
                    alt=""
                    width={160}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium text-ink">{video.title}</p>
                {video.description && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-ink/50">{video.description}</p>
                )}
              </div>

              <VideoActiveToggle id={video.id} isActive={video.isActive} />

              <Link href={`/admin/videos/${video.id}/edit`} className="text-sm text-brass hover:text-brasslight">
                Edit
              </Link>
              <form action={deleteVideo.bind(null, video.id)}>
                <button type="submit" className="text-sm text-ink/40 hover:text-red-600">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
