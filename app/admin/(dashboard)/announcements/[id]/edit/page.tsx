import { notFound } from "next/navigation";
import AnnouncementForm from "@/components/AnnouncementForm";
import { prisma } from "@/lib/prisma";
import { updateAnnouncement } from "@/lib/actions/announcements";

export default async function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!announcement) notFound();

  const boundUpdate = updateAnnouncement.bind(null, announcement.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Edit announcement</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <AnnouncementForm action={boundUpdate} announcement={announcement} />
      </div>
    </div>
  );
}
