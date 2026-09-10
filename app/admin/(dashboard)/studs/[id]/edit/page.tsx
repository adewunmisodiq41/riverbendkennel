import { notFound } from "next/navigation";
import StudForm from "@/components/StudForm";
import { prisma } from "@/lib/prisma";
import { updateStud } from "@/lib/actions/studs";

export default async function EditStudPage({ params }: { params: { id: string } }) {
  const stud = await prisma.stud.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: "asc" } } }
  });

  if (!stud) notFound();

  const boundUpdate = updateStud.bind(null, stud.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Edit {stud.name}</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <StudForm action={boundUpdate} stud={stud} submitLabel="Save changes" />
      </div>
    </div>
  );
}
