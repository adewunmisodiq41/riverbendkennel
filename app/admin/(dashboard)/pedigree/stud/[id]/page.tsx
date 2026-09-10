import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePedigree } from "@/lib/actions/pedigree";
import PedigreeEditorForm from "@/components/PedigreeEditorForm";

export default async function EditStudPedigreePage({ params }: { params: { id: string } }) {
  const stud = await prisma.stud.findUnique({ where: { id: params.id } });
  if (!stud) notFound();

  const existing = await prisma.pedigreeEntry.findUnique({
    where: { studId: stud.id },
    include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } }
  });

  const boundSave = savePedigree.bind(null, "STUD", stud.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Pedigree — {stud.name}</h1>
      <div className="mt-8 max-w-3xl bg-paper p-8">
        <PedigreeEditorForm action={boundSave} subjectName={stud.name} existing={existing} />
      </div>
    </div>
  );
}
