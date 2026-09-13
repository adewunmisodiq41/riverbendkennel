import { notFound } from "next/navigation";
import VideoForm from "@/components/VideoForm";
import { prisma } from "@/lib/prisma";
import { updateVideo } from "@/lib/actions/videos";

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const video = await prisma.video.findUnique({ where: { id: params.id } });
  if (!video) notFound();

  const boundUpdate = updateVideo.bind(null, video.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Edit {video.title}</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <VideoForm action={boundUpdate} video={video} submitLabel="Save changes" />
      </div>
    </div>
  );
}
