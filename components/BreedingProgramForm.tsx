import { prisma } from "@/lib/prisma";
import type { BreedingProgram } from "@prisma/client";

export default async function BreedingProgramForm({
  action,
  program,
  submitLabel
}: {
  action: (formData: FormData) => void;
  program?: BreedingProgram;
  submitLabel: string;
}) {
  const [studs, dams] = await Promise.all([
    prisma.stud.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, breed: true } }),
    prisma.dog.findMany({
      where: { gender: "FEMALE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, breed: true }
    })
  ]);

  return (
    <form action={action} className="space-y-6">
      <Field label="Title">
        <input name="title" required defaultValue={program?.title} className={inputClass} />
      </Field>

      <Field label="Short summary (shown on the home page and listing)">
        <textarea name="summary" rows={2} required defaultValue={program?.summary} className={inputClass} />
      </Field>

      <Field label="Full description">
        <textarea name="body" rows={6} defaultValue={program?.body ?? ""} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sire (stud)">
          <select name="sireId" defaultValue={program?.sireId ?? ""} className={inputClass}>
            <option value="">— None selected —</option>
            {studs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.breed})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Dam (female dog)">
          <select name="damId" defaultValue={program?.damId ?? ""} className={inputClass}>
            <option value="">— None selected —</option>
            {dams.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.breed})
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" name="isFeatured" defaultChecked={program?.isFeatured ?? false} />
          Feature on the home page
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" name="publish" defaultChecked={!!program?.publishedAt} />
          Published (visible on the site)
        </label>
      </div>

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
