import DogForm from "@/components/DogForm";
import { createDog } from "@/lib/actions/dogs";

export default function NewDogPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Add a dog</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <DogForm action={createDog} submitLabel="Add dog" />
      </div>
    </div>
  );
}
