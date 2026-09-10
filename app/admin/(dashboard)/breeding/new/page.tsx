import BreedingProgramForm from "@/components/BreedingProgramForm";
import { createBreedingProgram } from "@/lib/actions/breeding";

export default function NewBreedingProgramPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Add a breeding program</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <BreedingProgramForm action={createBreedingProgram} submitLabel="Add program" />
      </div>
    </div>
  );
}
