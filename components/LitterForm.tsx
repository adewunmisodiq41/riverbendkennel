import ImageUrlFields from "@/components/ImageUrlFields";
import type { Litter, Image as LitterImage } from "@prisma/client";

type LitterWithImages = Litter & { images: LitterImage[] };

export default function LitterForm({
  action,
  litter,
  submitLabel
}: {
  action: (formData: FormData) => void;
  litter?: LitterWithImages;
  submitLabel: string;
}) {
  const expectedDateValue = litter?.expectedDate ? new Date(litter.expectedDate).toISOString().slice(0, 10) : "";
  const bornDateValue = litter?.bornDate ? new Date(litter.bornDate).toISOString().slice(0, 10) : "";

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sire name">
          <input name="sireName" required defaultValue={litter?.sireName} className={inputClass} />
        </Field>
        <Field label="Dam name">
          <input name="damName" required defaultValue={litter?.damName} className={inputClass} />
        </Field>
        <Field label="Breed">
          <input name="breed" required defaultValue={litter?.breed} className={inputClass} />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={litter?.status ?? "PLANNED"} className={inputClass}>
            <option value="PLANNED">Planned</option>
            <option value="EXPECTING">Expecting</option>
            <option value="BORN">Born</option>
            <option value="ALL_RESERVED">All reserved</option>
          </select>
        </Field>
        <Field label="Expected date">
          <input type="date" name="expectedDate" defaultValue={expectedDateValue} className={inputClass} />
        </Field>
        <Field label="Born date (once known)">
          <input type="date" name="bornDate" defaultValue={bornDateValue} className={inputClass} />
        </Field>
      </div>

      <Field label="Description">
        <textarea name="description" rows={4} defaultValue={litter?.description ?? ""} className={inputClass} />
      </Field>

      <ImageUrlFields initial={litter?.images} />

      <button type="submit" className="bg-pine px-6 py-3 text-sm font-medium text-paper hover:bg-ink">
        {submitLabel}
      </button>
    </form>
  );
}

const inputClass = "w-full border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-ink/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
