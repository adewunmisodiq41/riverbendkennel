import VideoFileUpload from "@/components/VideoFileUpload";
import LogoUpload from "@/components/LogoUpload";
import type { Video } from "@prisma/client";

export default function VideoForm({
  action,
  video,
  submitLabel
}: {
  action: (formData: FormData) => void;
  video?: Video;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <Field label="Title">
        <input name="title" required defaultValue={video?.title} className={inputClass} />
      </Field>

      <Field label="Description (optional)">
        <textarea name="description" rows={3} defaultValue={video?.description ?? ""} className={inputClass} />
      </Field>

      <VideoFileUpload initialUrl={video?.videoUrl} initialDurationSeconds={video?.durationSeconds} />

      <LogoUpload
        initialUrl={video?.thumbnailUrl}
        label="Thumbnail (shown before the video plays)"
        fieldName="thumbnailUrl"
      />

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" name="isActive" defaultChecked={video?.isActive ?? true} />
        Show on the homepage
      </label>

      <button type="submit" className="bg-pine px-6 py-3 text-sm font-medium text-paper hover:bg-ink">
        {submitLabel}
      </button>
    </form>
  );
}

const inputClass = "w-full border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-ink/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
