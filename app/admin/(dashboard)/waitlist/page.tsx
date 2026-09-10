import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deleteWaitlistEntry } from "@/lib/actions/litters";

export default async function AdminWaitlistPage() {
  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
    include: { litter: { select: { sireName: true, damName: true } } }
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Waitlist</h1>

      {entries.length === 0 ? (
        <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-center text-sm text-ink/60">
          No signups yet.
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-mist bg-paper">
          {entries.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-4 px-6 py-4">
              <div>
                <p className="font-medium text-ink">{e.name}</p>
                <p className="text-sm text-ink/60">
                  {e.email}
                  {e.phone ? ` · ${e.phone}` : ""}
                </p>
                <p className="mt-1 text-sm text-ink/50">
                  {e.litter ? `Interested in: ${e.litter.sireName} × ${e.litter.damName}` : "General waitlist"} ·{" "}
                  {formatDate(e.createdAt)}
                </p>
                {e.notes && <p className="mt-2 text-sm text-ink/70">{e.notes}</p>}
              </div>
              <form action={deleteWaitlistEntry.bind(null, e.id)}>
                <button type="submit" className="shrink-0 text-sm text-ink/40 hover:text-red-600">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
