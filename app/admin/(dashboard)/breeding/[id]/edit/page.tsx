import { notFound } from "next/navigation";
import BreedingProgramForm from "@/components/BreedingProgramForm";
import { prisma } from "@/lib/prisma";
import { updateBreedingProgram } from "@/lib/actions/breeding";

export default async function EditBreedingProgramPage({ params }: { params: { id: string } }) {
  const program = await prisma.breedingProgram.findUnique({ where: { id: params.id } });
  if (!program) notFound();

  const boundUpdate = updateBreedingProgram.bind(null, program.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Edit {program.title}</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <BreedingProgramForm action={boundUpdate} program={program} submitLabel="Save changes" />
      </div>
    </div>
  );
}
