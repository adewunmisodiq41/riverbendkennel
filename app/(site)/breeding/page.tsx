import Link from "next/link";
import { prisma } from "@/lib/prisma";
import InquiryForm from "@/components/InquiryForm";

export const metadata = { title: "Breeding services" };

export default async function BreedingPage() {
  const programs = await prisma.breedingProgram.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }]
  });

  const pairIds = Array.from(
    new Set(programs.flatMap((p) => [p.sireId, p.damId]).filter((v): v is string => !!v))
  );

  const [studs, dogs] = await Promise.all([
    prisma.stud.findMany({ where: { id: { in: pairIds } }, select: { id: true, name: true, slug: true } }),
    prisma.dog.findMany({ where: { id: { in: pairIds } }, select: { id: true, name: true, slug: true } })
  ]);

  function pairLabel(id: string | null) {
    if (!id) return null;
    const stud = studs.find((s) => s.id === id);
    if (stud) return { name: stud.name, href: `/studs/${stud.slug}` };
    const dog = dogs.find((d) => d.id === id);
    if (dog) return { name: dog.name, href: `/dogs/${dog.slug}` };
    return null;
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Breeding services</h1>
      <p className="mt-3 max-w-prose text-ink/60">
        We plan a limited number of litters each year, choosing pairs for health clearances,
        temperament, and structure — not a calendar.
      </p>

      {programs.length === 0 ? (
        <div className="mt-10 border border-dashed border-mist p-12 text-center text-ink/50">
          Details on our current breeding program are being finalized —{" "}
          <Link href="/contact" className="text-brass hover:text-brasslight">
            reach out
          </Link>{" "}
          with any questions in the meantime.
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {programs.map((program) => {
            const sire = pairLabel(program.sireId);
            const dam = pairLabel(program.damId);
            return (
              <article key={program.id} className="border-t-2 border-brass pt-6">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl text-ink">{program.title}</h2>
                  {program.isFeatured && (
                    <span className="bg-brass/15 px-2 py-1 text-xs uppercase tracking-wide text-brass">
                      Featured
                    </span>
                  )}
                </div>
                {(sire || dam) && (
                  <p className="mt-1 text-sm text-ink/60">
                    {sire && (
                      <Link href={sire.href} className="hover:text-brass">
                        {sire.name}
                      </Link>
                    )}
                    {sire && dam && " × "}
                    {dam && (
                      <Link href={dam.href} className="hover:text-brass">
                        {dam.name}
                      </Link>
                    )}
                  </p>
                )}
                <p className="mt-3 text-ink/70">{program.summary}</p>
                {program.body && <p className="mt-3 whitespace-pre-line text-ink/70">{program.body}</p>}
              </article>
            );
          })}
        </div>
      )}

      <div className="mx-auto mt-16 max-w-xl border-t border-mist pt-10">
        <h2 className="font-display text-2xl text-ink">Ask about breeding services</h2>
        <p className="mt-2 text-sm text-ink/60">
          Tell us what you're looking for and we'll let you know how our program fits.
        </p>
        <div className="mt-6">
          <InquiryForm type="BREEDING" subjectLabel="your breeding program" />
        </div>
      </div>
    </section>
  );
}
