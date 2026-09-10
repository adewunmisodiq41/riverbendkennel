import { notFound } from "next/navigation";
import DogForm from "@/components/DogForm";
import { prisma } from "@/lib/prisma";
import { updateDog } from "@/lib/actions/dogs";

export default async function EditDogPage({ params }: { params: { id: string } }) {
  const dog = await prisma.dog.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: "asc" } } }
  });

  if (!dog) notFound();

  const boundUpdate = updateDog.bind(null, dog.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Edit {dog.name}</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <DogForm action={boundUpdate} dog={dog} submitLabel="Save changes" />
      </div>
    </div>
  );
}
