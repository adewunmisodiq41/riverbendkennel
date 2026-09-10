import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatAge } from "@/lib/format";
import type { DogGender, DogStatus, Prisma } from "@prisma/client";

export const metadata = { title: "Dogs for sale" };

type SearchParams = {
  gender?: string;
  breed?: string;
  age?: string;
  status?: string;
};

export default async function DogsPage({ searchParams }: { searchParams: SearchParams }) {
  const gender = searchParams.gender && searchParams.gender !== "ALL" ? (searchParams.gender as DogGender) : undefined;
  const breed = searchParams.breed && searchParams.breed !== "ALL" ? searchParams.breed : undefined;
  const statusParam = searchParams.status ?? "AVAILABLE";
  const status = statusParam === "ALL" ? undefined : (statusParam as DogStatus);
  const age = searchParams.age;

  const where: Prisma.DogWhereInput = {};
  if (gender) where.gender = gender;
  if (breed) where.breed = breed;
  if (status) where.status = status;

  if (age === "puppy" || age === "adult") {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    where.birthDate = age === "puppy" ? { gte: cutoff } : { lt: cutoff };
  }

  const [dogs, breeds] = await Promise.all([
    prisma.dog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } }
    }),
    prisma.dog.findMany({ distinct: ["breed"], select: { breed: true }, orderBy: { breed: "asc" } })
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Dogs for sale</h1>
      <p className="mt-2 max-w-prose text-ink/60">
        Every dog below is raised in our home and health-tested before going to a new family.
      </p>

      <form method="get" className="mt-8 flex flex-wrap gap-3 border-y border-mist py-5">
        <select name="gender" defaultValue={searchParams.gender ?? "ALL"} className={selectClass}>
          <option value="ALL">Any gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <select name="breed" defaultValue={searchParams.breed ?? "ALL"} className={selectClass}>
          <option value="ALL">Any breed</option>
          {breeds.map((b) => (
            <option key={b.breed} value={b.breed}>
              {b.breed}
            </option>
          ))}
        </select>

        <select name="age" defaultValue={searchParams.age ?? "ALL"} className={selectClass}>
          <option value="ALL">Any age</option>
          <option value="puppy">Puppy (under 1 year)</option>
          <option value="adult">Adult</option>
        </select>

        <select name="status" defaultValue={statusParam} className={selectClass}>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Recently sold</option>
          <option value="ALL">All</option>
        </select>

        <button type="submit" className="bg-pine px-5 py-2 text-sm font-medium text-paper hover:bg-ink">
          Apply filters
        </button>
      </form>

      {dogs.length === 0 ? (
        <div className="mt-10 border border-dashed border-mist p-12 text-center text-ink/50">
          No dogs match those filters right now — try widening your search, or{" "}
          <Link href="/contact" className="text-brass hover:text-brasslight">
            get in touch
          </Link>{" "}
          and we'll let you know when one becomes available.
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dogs.map((dog) => (
            <Link key={dog.id} href={`/dogs/${dog.slug}`} className="group border-t-2 border-brass pt-4">
              <div className="relative aspect-[4/3] overflow-hidden bg-paperdim">
                {dog.images[0] ? (
                  <Image
                    src={dog.images[0].url}
                    alt={dog.images[0].altText ?? dog.name}
                    width={480}
                    height={360}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink/30">
                    Photo coming soon
                  </div>
                )}
                {dog.status !== "AVAILABLE" && (
                  <span className="absolute left-3 top-3 bg-ink/85 px-2 py-1 text-xs uppercase tracking-wide text-paper">
                    {dog.status === "SOLD" ? "Sold" : "Reserved"}
                  </span>
                )}
              </div>
              <p className="mt-4 font-display text-lg text-ink">{dog.name}</p>
              <p className="text-sm text-ink/60">
                {dog.breed} · {dog.gender === "MALE" ? "Male" : "Female"} · {formatAge(dog.birthDate)}
              </p>
              <p className="mt-1 text-sm font-medium text-brass">{formatPrice(dog.priceCents)}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

const selectClass = "border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass";
