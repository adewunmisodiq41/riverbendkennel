import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Pedigree" };

export default async function PedigreeIndexPage() {
  const [dogs, studs] = await Promise.all([
    prisma.dog.findMany({ where: { pedigree: { isNot: null } }, select: { name: true, slug: true, breed: true } }),
    prisma.stud.findMany({ where: { pedigree: { isNot: null } }, select: { name: true, slug: true, breed: true } })
  ]);

  const entries = [...dogs, ...studs];

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Pedigree</h1>
      <p className="mt-3 max-w-prose text-ink/60">
        Family trees for our dogs and studs — parents and grandparents, with titles where earned.
      </p>

      {entries.length === 0 ? (
        <div className="mt-10 border border-dashed border-mist p-12 text-center text-ink/50">
          Pedigree charts are being added — check back soon, or visit a specific dog or stud's
          profile for what's available now.
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-mist bg-paper">
          {entries.map((e) => (
            <li key={e.slug} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-ink">{e.name}</p>
                <p className="text-sm text-ink/50">{e.breed}</p>
              </div>
              <Link href={`/pedigree/${e.slug}`} className="text-sm text-brass hover:text-brasslight">
                View family tree
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
