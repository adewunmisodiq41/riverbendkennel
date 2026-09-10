import StudForm from "@/components/StudForm";
import { createStud } from "@/lib/actions/studs";

export default function NewStudPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Add a stud</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <StudForm action={createStud} submitLabel="Add stud" />
      </div>
    </div>
  );
}
