import LitterForm from "@/components/LitterForm";
import { createLitter } from "@/lib/actions/litters";

export default function NewLitterPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Add a litter</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <LitterForm action={createLitter} submitLabel="Add litter" />
      </div>
    </div>
  );
}
