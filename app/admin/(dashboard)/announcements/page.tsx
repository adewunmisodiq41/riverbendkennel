import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAnnouncement } from "@/lib/actions/announcements";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Announcements</h1>
        <Link href="/admin/announcements/new" className="bg-pine px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink">
          New announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-center text-sm text-ink/60">
          Nothing posted yet.{" "}
          <Link href="/admin/announcements/new" className="text-brass hover:text-brasslight">
            Write your first one
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-mist bg-paper">
          {announcements.map((a) => (
            <li key={a.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-ink">{a.title}</p>
                <p className="text-sm text-ink/50">{a.isPublished ? "Published" : "Draft"}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href={`/admin/announcements/${a.id}/edit`} className="text-brass hover:text-brasslight">
                  Edit
                </Link>
                <form action={deleteAnnouncement.bind(null, a.id)}>
                  <button type="submit" className="text-ink/40 hover:text-red-600">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
