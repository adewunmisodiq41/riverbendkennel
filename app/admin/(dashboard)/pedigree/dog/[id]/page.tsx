import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePedigree } from "@/lib/actions/pedigree";
import PedigreeEditorForm from "@/components/PedigreeEditorForm";

export default async function EditDogPedigreePage({ params }: { params: { id: string } }) {
  const dog = await prisma.dog.findUnique({ where: { id: params.id } });
  if (!dog) notFound();

  const existing = await prisma.pedigreeEntry.findUnique({
    where: { dogId: dog.id },
    include: { sire: { include: { sire: true, dam: true } }, dam: { include: { sire: true, dam: true } } }
  });

  const boundSave = savePedigree.bind(null, "DOG", dog.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Pedigree — {dog.name}</h1>
      <div className="mt-8 max-w-3xl bg-paper p-8">
        <PedigreeEditorForm action={boundSave} subjectName={dog.name} existing={existing} />
      </div>
    </div>
  );
}
