import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await prisma.announcement.findUnique({ where: { slug: params.slug } });
  return { title: a ? a.title : "Announcement" };
}

export default async function AnnouncementDetailPage({ params }: { params: { slug: string } }) {
  const announcement = await prisma.announcement.findUnique({ where: { slug: params.slug } });
  if (!announcement || !announcement.isPublished) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/announcements" className="text-sm text-brass hover:text-brasslight">
        ← All announcements
      </Link>
      <h1 className="mt-4 font-display text-4xl text-ink">{announcement.title}</h1>
      <p className="mt-2 text-sm text-ink/50">{formatDate(announcement.publishedAt)}</p>
      <div className="mt-8 max-w-none whitespace-pre-line leading-relaxed text-ink/80">
        {announcement.body}
      </div>
    </article>
  );
}
