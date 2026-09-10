import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [
    dogsAvailable,
    studsAvailable,
    litterCount,
    waitlistCount,
    newInquiries,
    draftPosts,
    unpublishedAnnouncements
  ] = await Promise.all([
    prisma.dog.count({ where: { status: "AVAILABLE" } }),
    prisma.stud.count({ where: { isAvailable: true } }),
    prisma.litter.count(),
    prisma.waitlistEntry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.blogPost.count({ where: { isPublished: false } }),
    prisma.announcement.count({ where: { isPublished: false } })
  ]);

  const stats = [
    { label: "Dogs available", value: dogsAvailable, href: "/admin/dogs" },
    { label: "Studs available", value: studsAvailable, href: "/admin/studs" },
    { label: "Litters tracked", value: litterCount, href: "/admin/litters" },
    { label: "Waitlist signups", value: waitlistCount, href: "/admin/waitlist" },
    { label: "New inquiries", value: newInquiries, href: "/admin/inquiries" },
    { label: "Blog drafts", value: draftPosts, href: "/admin/blog" },
    { label: "Unpublished announcements", value: unpublishedAnnouncements, href: "/admin/announcements" }
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Overview</h1>
      <p className="mt-1 text-sm text-ink/60">A snapshot of what needs attention.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border-t-2 border-brass bg-paper p-6 transition-colors hover:bg-white"
          >
            <p className="font-display text-3xl text-ink">{stat.value}</p>
            <p className="mt-1 text-sm text-ink/60">{stat.label}</p>
          </Link>
        ))}
      </div>

      {newInquiries > 0 && (
        <div className="mt-8 border border-brass/40 bg-brass/10 p-5 text-sm text-ink">
          You have {newInquiries} new {newInquiries === 1 ? "inquiry" : "inquiries"} waiting.{" "}
          <Link href="/admin/inquiries" className="font-medium text-brass hover:text-brasslight">
            Review them
          </Link>
          .
        </div>
      )}
    </div>
  );
}
