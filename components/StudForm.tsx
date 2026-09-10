import ImageUrlFields from "@/components/ImageUrlFields";
import type { Stud, Image as StudImage } from "@prisma/client";

type StudWithImages = Stud & { images: StudImage[] };

export default function StudForm({
  action,
  stud,
  submitLabel
}: {
  action: (formData: FormData) => void;
  stud?: StudWithImages;
  submitLabel: string;
}) {
  const feeDollars = stud?.studFeeCents != null ? (stud.studFeeCents / 100).toFixed(2) : "";
  const birthDateValue = stud?.birthDate ? new Date(stud.birthDate).toISOString().slice(0, 10) : "";

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" required defaultValue={stud?.name} className={inputClass} />
        </Field>
        <Field label="Breed">
          <input name="breed" required defaultValue={stud?.breed} className={inputClass} />
        </Field>

        <Field label="Birth date">
          <input type="date" name="birthDate" defaultValue={birthDateValue} className={inputClass} />
        </Field>
        <Field label="Color">
          <input name="color" defaultValue={stud?.color ?? ""} className={inputClass} />
        </Field>

        <Field label="Weight (lbs)">
          <input type="number" step="0.1" name="weightLbs" defaultValue={stud?.weightLbs ?? ""} className={inputClass} />
        </Field>
        <Field label="Stud fee (USD, leave blank for 'on request')">
          <input type="number" step="0.01" name="studFeeDollars" defaultValue={feeDollars} className={inputClass} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" name="isAvailable" defaultChecked={stud?.isAvailable ?? true} />
        Available for booking
      </label>

      <Field label="Achievements / titles">
        <textarea name="achievements" rows={3} defaultValue={stud?.achievements ?? ""} className={inputClass} />
      </Field>

      <Field label="Health information (clearances, testing, etc.)">
        <textarea name="healthInfo" rows={3} defaultValue={stud?.healthInfo ?? ""} className={inputClass} />
      </Field>

      <ImageUrlFields initial={stud?.images} />

      <button
        type="submit"
        className="bg-pine px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink"
      >
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
