import type { Announcement } from "@prisma/client";

export default function AnnouncementForm({
  action,
  announcement
}: {
  action: (formData: FormData) => void;
  announcement?: Announcement;
}) {
  return (
    <form action={action} className="space-y-6">
      <Field label="Title">
        <input name="title" required defaultValue={announcement?.title} className={inputClass} />
      </Field>
      <Field label="Body">
        <textarea name="body" rows={8} required defaultValue={announcement?.body ?? ""} className={inputClass} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" name="publish" defaultChecked={announcement?.isPublished ?? false} />
        Published (visible on the site)
      </label>
      <button type="submit" className="bg-pine px-6 py-3 text-sm font-medium text-paper hover:bg-ink">
        Save
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
