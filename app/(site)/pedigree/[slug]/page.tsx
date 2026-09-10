import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PedigreeTree from "@/components/PedigreeTree";

export default async function PedigreePage({ params }: { params: { slug: string } }) {
  const [dog, stud] = await Promise.all([
    prisma.dog.findUnique({ where: { slug: params.slug } }),
    prisma.stud.findUnique({ where: { slug: params.slug } })
  ]);

  const subject = dog ?? stud;
  if (!subject) notFound();

  const entry = dog
    ? await prisma.pedigreeEntry.findUnique({
        where: { dogId: dog.id },
        include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } }
      })
    : await prisma.pedigreeEntry.findUnique({
        where: { studId: stud!.id },
        include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } }
      });

  if (!entry) notFound();

  const backHref = dog ? `/dogs/${dog.slug}` : `/studs/${stud!.slug}`;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Link href={backHref} className="text-sm text-brass hover:text-brasslight">
        ← Back to {subject.name}
      </Link>

      <h1 className="mt-4 font-display text-4xl text-ink">{subject.name}'s pedigree</h1>

      <div className="mt-10">
        <PedigreeTree root={entry} />
      </div>
    </section>
  );
}
