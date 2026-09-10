import AnnouncementForm from "@/components/AnnouncementForm";
import { createAnnouncement } from "@/lib/actions/announcements";

export default function NewAnnouncementPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">New announcement</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <AnnouncementForm action={createAnnouncement} />
      </div>
    </div>
  );
}
