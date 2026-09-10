import ImageUrlFields from "@/components/ImageUrlFields";
import type { Dog, Image as DogImage } from "@prisma/client";

type DogWithImages = Dog & { images: DogImage[] };

export default function DogForm({
  action,
  dog,
  submitLabel
}: {
  action: (formData: FormData) => void;
  dog?: DogWithImages;
  submitLabel: string;
}) {
  const priceDollars = dog?.priceCents != null ? (dog.priceCents / 100).toFixed(2) : "";
  const birthDateValue = dog?.birthDate ? new Date(dog.birthDate).toISOString().slice(0, 10) : "";

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" required defaultValue={dog?.name} className={inputClass} />
        </Field>
        <Field label="Breed">
          <input name="breed" required defaultValue={dog?.breed} className={inputClass} />
        </Field>

        <Field label="Gender">
          <select name="gender" defaultValue={dog?.gender ?? "MALE"} className={inputClass}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={dog?.status ?? "AVAILABLE"} className={inputClass}>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </Field>

        <Field label="Birth date">
          <input type="date" name="birthDate" defaultValue={birthDateValue} className={inputClass} />
        </Field>
        <Field label="Color">
          <input name="color" defaultValue={dog?.color ?? ""} className={inputClass} />
        </Field>

        <Field label="Weight (lbs)">
          <input type="number" step="0.1" name="weightLbs" defaultValue={dog?.weightLbs ?? ""} className={inputClass} />
        </Field>
        <Field label="Price (USD, leave blank for 'price on request')">
          <input type="number" step="0.01" name="priceDollars" defaultValue={priceDollars} className={inputClass} />
        </Field>
      </div>

      <Field label="Description">
        <textarea name="description" rows={4} defaultValue={dog?.description ?? ""} className={inputClass} />
      </Field>

      <Field label="Health notes (clearances, vaccinations, etc.)">
        <textarea name="healthNotes" rows={3} defaultValue={dog?.healthNotes ?? ""} className={inputClass} />
      </Field>

      <ImageUrlFields initial={dog?.images} />

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
