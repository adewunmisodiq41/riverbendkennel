import VideoForm from "@/components/VideoForm";
import { createVideo } from "@/lib/actions/videos";

export default function NewVideoPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Add a video</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <VideoForm action={createVideo} submitLabel="Add video" />
      </div>
    </div>
  );
}
