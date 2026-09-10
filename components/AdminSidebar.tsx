import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const SECTIONS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/dogs", label: "Dogs for sale" },
  { href: "/admin/studs", label: "Studs" },
  { href: "/admin/breeding", label: "Breeding services" },
  { href: "/admin/pedigree", label: "Pedigrees" },
  { href: "/admin/litters", label: "Upcoming litters" },
  { href: "/admin/waitlist", label: "Waitlist" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings/admins", label: "Manage admins" }
];

export default function AdminSidebar({ userName }: { userName?: string | null }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-ink text-paper">
      <div className="px-6 py-6">
        <p className="font-display text-lg">Riverbend Kennel</p>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-paper/40">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block px-3 py-2 text-sm text-paper/80 transition-colors hover:bg-paper/5 hover:text-paper"
          >
            {s.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between border-t border-paper/10 px-6 py-4">
        <span className="truncate text-sm text-paper/60">{userName ?? "Admin"}</span>
        <SignOutButton />
      </div>
    </aside>
  );
}
