import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" }
  });

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Announcements</h1>
      <p className="mt-2 text-ink/60">News from the kennel — new arrivals, litters, and updates.</p>

      {announcements.length === 0 ? (
        <div className="mt-10 border border-dashed border-mist p-12 text-center text-ink/50">
          Nothing posted yet — check back soon.
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-mist">
          {announcements.map((a) => (
            <li key={a.id} className="py-6">
              <Link href={`/announcements/${a.slug}`} className="font-display text-xl text-ink hover:text-brass">
                {a.title}
              </Link>
              <p className="mt-1 text-sm text-ink/50">{formatDate(a.publishedAt)}</p>
              <p className="mt-2 text-ink/70 line-clamp-2">{a.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
