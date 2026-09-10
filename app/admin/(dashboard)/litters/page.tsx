import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deleteLitter } from "@/lib/actions/litters";

const STATUS_LABEL: Record<string, string> = {
  PLANNED: "Planned",
  EXPECTING: "Expecting",
  BORN: "Born",
  ALL_RESERVED: "All reserved"
};

export default async function AdminLittersPage() {
  const litters = await prisma.litter.findMany({
    orderBy: { expectedDate: "asc" },
    include: { _count: { select: { waitlist: true } } }
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Upcoming litters</h1>
        <Link href="/admin/litters/new" className="bg-pine px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink">
          Add a litter
        </Link>
      </div>

      {litters.length === 0 ? (
        <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-center text-sm text-ink/60">
          No litters yet.{" "}
          <Link href="/admin/litters/new" className="text-brass hover:text-brasslight">
            Add your first one
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-mist bg-paper">
          {litters.map((l) => (
            <li key={l.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-ink">
                  {l.sireName} × {l.damName}
                </p>
                <p className="text-sm text-ink/50">
                  {l.breed} · {STATUS_LABEL[l.status]} · Expected {formatDate(l.expectedDate)} ·{" "}
                  {l._count.waitlist} on waitlist
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href={`/admin/litters/${l.id}/edit`} className="text-brass hover:text-brasslight">
                  Edit
                </Link>
                <form action={deleteLitter.bind(null, l.id)}>
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
