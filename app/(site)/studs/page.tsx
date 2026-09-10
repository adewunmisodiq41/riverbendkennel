import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatAge } from "@/lib/format";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Available studs" };

type SearchParams = { breed?: string; availability?: string };

export default async function StudsPage({ searchParams }: { searchParams: SearchParams }) {
  const breed = searchParams.breed && searchParams.breed !== "ALL" ? searchParams.breed : undefined;
  const availability = searchParams.availability ?? "AVAILABLE";

  const where: Prisma.StudWhereInput = {};
  if (breed) where.breed = breed;
  if (availability === "AVAILABLE") where.isAvailable = true;
  if (availability === "UNAVAILABLE") where.isAvailable = false;

  const [studs, breeds] = await Promise.all([
    prisma.stud.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } }
    }),
    prisma.stud.findMany({ distinct: ["breed"], select: { breed: true }, orderBy: { breed: "asc" } })
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Available studs</h1>
      <p className="mt-2 max-w-prose text-ink/60">
        Health-tested, titled where noted, and proven in past litters.
      </p>

      <form method="get" className="mt-8 flex flex-wrap gap-3 border-y border-mist py-5">
        <select name="breed" defaultValue={searchParams.breed ?? "ALL"} className={selectClass}>
          <option value="ALL">Any breed</option>
          {breeds.map((b) => (
            <option key={b.breed} value={b.breed}>
              {b.breed}
            </option>
          ))}
        </select>

        <select name="availability" defaultValue={availability} className={selectClass}>
          <option value="AVAILABLE">Available now</option>
          <option value="UNAVAILABLE">Not currently available</option>
          <option value="ALL">All</option>
        </select>

        <button type="submit" className="bg-pine px-5 py-2 text-sm font-medium text-paper hover:bg-ink">
          Apply filters
        </button>
      </form>

      {studs.length === 0 ? (
        <div className="mt-10 border border-dashed border-mist p-12 text-center text-ink/50">
          No studs match those filters right now —{" "}
          <Link href="/contact" className="text-brass hover:text-brasslight">
            get in touch
          </Link>{" "}
          and we'll share what's coming up.
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {studs.map((stud) => (
            <Link key={stud.id} href={`/studs/${stud.slug}`} className="group border-t-2 border-brass pt-4">
              <div className="relative aspect-[4/3] overflow-hidden bg-paperdim">
                {stud.images[0] ? (
                  <Image
                    src={stud.images[0].url}
                    alt={stud.images[0].altText ?? stud.name}
                    width={480}
                    height={360}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink/30">
                    Photo coming soon
                  </div>
                )}
                {!stud.isAvailable && (
                  <span className="absolute left-3 top-3 bg-ink/85 px-2 py-1 text-xs uppercase tracking-wide text-paper">
                    Not available
                  </span>
                )}
              </div>
              <p className="mt-4 font-display text-lg text-ink">{stud.name}</p>
              <p className="text-sm text-ink/60">
                {stud.breed} · {formatAge(stud.birthDate)}
              </p>
              <p className="mt-1 text-sm font-medium text-brass">{formatPrice(stud.studFeeCents)}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

const selectClass = "border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass";
