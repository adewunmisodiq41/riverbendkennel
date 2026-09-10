import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata = { title: "Upcoming litters" };

const STATUS_LABEL: Record<string, string> = {
  PLANNED: "Planned",
  EXPECTING: "Expecting",
  BORN: "Born",
  ALL_RESERVED: "All reserved"
};

export default async function LittersPage() {
  const litters = await prisma.litter.findMany({
    where: { status: { not: "ALL_RESERVED" } },
    orderBy: { expectedDate: "asc" },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } }
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Upcoming litters</h1>
      <p className="mt-2 max-w-prose text-ink/60">
        Join the waitlist for a specific litter below, or the general list if you're flexible on
        timing.
      </p>

      {litters.length === 0 ? (
        <div className="mt-10 border border-dashed border-mist p-12 text-center text-ink/50">
          Nothing planned right now — join the general waitlist below and we'll reach out as soon
          as something is expected.
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {litters.map((litter) => (
            <article key={litter.id} className="grid gap-6 border-t-2 border-brass pt-6 md:grid-cols-[1fr,1.3fr]">
              <div className="aspect-[4/3] overflow-hidden bg-paperdim">
                {litter.images[0] ? (
                  <Image
                    src={litter.images[0].url}
                    alt={litter.images[0].altText ?? `${litter.sireName} × ${litter.damName}`}
                    width={480}
                    height={360}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink/30">
                    Photo coming soon
                  </div>
                )}
              </div>
              <div>
                <p className="font-display text-2xl text-ink">
                  {litter.sireName} × {litter.damName}
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  {litter.breed} · {STATUS_LABEL[litter.status]} · Expected {formatDate(litter.expectedDate)}
                </p>
                {litter.description && <p className="mt-3 text-ink/70">{litter.description}</p>}

                <div className="mt-5 border-t border-mist pt-5">
                  <p className="mb-2 text-sm font-medium text-ink">Join the waitlist for this litter</p>
                  <WaitlistForm litterId={litter.id} compact />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mx-auto mt-16 max-w-xl border-t border-mist pt-10">
        <h2 className="font-display text-2xl text-ink">General waitlist</h2>
        <p className="mt-2 text-sm text-ink/60">
          Not set on a specific pairing? Join our general list and we'll reach out about any
          upcoming litter that fits.
        </p>
        <div className="mt-6">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
