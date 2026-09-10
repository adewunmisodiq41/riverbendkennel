import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPedigreeIndexPage() {
  const [dogs, studs] = await Promise.all([
    prisma.dog.findMany({ orderBy: { name: "asc" }, include: { pedigree: true } }),
    prisma.stud.findMany({ orderBy: { name: "asc" }, include: { pedigree: true } })
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Pedigrees</h1>
      <p className="mt-1 text-sm text-ink/60">
        Build a 3-generation pedigree chart for any dog or stud.
      </p>

      <Section title="Dogs">
        {dogs.map((d) => (
          <Row key={d.id} name={d.name} hasPedigree={!!d.pedigree} href={`/admin/pedigree/dog/${d.id}`} />
        ))}
        {dogs.length === 0 && <Empty />}
      </Section>

      <Section title="Studs">
        {studs.map((s) => (
          <Row key={s.id} name={s.name} hasPedigree={!!s.pedigree} href={`/admin/pedigree/stud/${s.id}`} />
        ))}
        {studs.length === 0 && <Empty />}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <ul className="mt-3 divide-y divide-mist bg-paper">{children}</ul>
    </div>
  );
}

function Row({ name, hasPedigree, href }: { name: string; hasPedigree: boolean; href: string }) {
  return (
    <li className="flex items-center justify-between px-6 py-3 text-sm">
      <span className="text-ink">{name}</span>
      <div className="flex items-center gap-3">
        <span className="text-ink/40">{hasPedigree ? "Pedigree set" : "No pedigree yet"}</span>
        <Link href={href} className="text-brass hover:text-brasslight">
          {hasPedigree ? "Edit" : "Add"}
        </Link>
      </div>
    </li>
  );
}

function Empty() {
  return <li className="px-6 py-6 text-center text-sm text-ink/40">None yet.</li>;
}
