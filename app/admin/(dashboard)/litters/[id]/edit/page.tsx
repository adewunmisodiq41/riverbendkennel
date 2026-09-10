import { notFound } from "next/navigation";
import LitterForm from "@/components/LitterForm";
import { prisma } from "@/lib/prisma";
import { updateLitter } from "@/lib/actions/litters";

export default async function EditLitterPage({ params }: { params: { id: string } }) {
  const litter = await prisma.litter.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: "asc" } } }
  });
  if (!litter) notFound();

  const boundUpdate = updateLitter.bind(null, litter.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">
        Edit {litter.sireName} × {litter.damName}
      </h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <LitterForm action={boundUpdate} litter={litter} submitLabel="Save changes" />
      </div>
    </div>
  );
}
