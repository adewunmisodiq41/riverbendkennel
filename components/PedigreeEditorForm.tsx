type Entry = { displayName: string; titles?: string | null; photoUrl?: string | null } | null;

export default function PedigreeEditorForm({
  action,
  subjectName,
  existing
}: {
  action: (formData: FormData) => void;
  subjectName: string;
  existing?: {
    titles?: string | null;
    sire?: (Entry & { sire?: Entry; dam?: Entry }) | null;
    dam?: (Entry & { sire?: Entry; dam?: Entry }) | null;
  } | null;
}) {
  const sire = existing?.sire;
  const dam = existing?.dam;

  return (
    <form action={action} className="space-y-8">
      <div>
        <p className="text-sm text-ink/50">Subject</p>
        <p className="font-display text-lg text-ink">{subjectName}</p>
        <Field label="Titles (optional)">
          <input name="rootTitles" defaultValue={existing?.titles ?? ""} className={inputClass} />
        </Field>
      </div>

      <Generation title="Parents">
        <PersonFields prefix="sire" label="Sire" entry={sire} />
        <PersonFields prefix="dam" label="Dam" entry={dam} />
      </Generation>

      <Generation title="Grandparents">
        <PersonFields prefix="ss" label="Sire's sire" entry={sire?.sire} compact />
        <PersonFields prefix="sd" label="Sire's dam" entry={sire?.dam} compact />
        <PersonFields prefix="ds" label="Dam's sire" entry={dam?.sire} compact />
        <PersonFields prefix="dd" label="Dam's dam" entry={dam?.dam} compact />
      </Generation>

      <button
        type="submit"
        className="bg-pine px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink"
      >
        Save pedigree
      </button>
    </form>
  );
}

function Generation({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg text-ink">{title}</h2>
      <div className="mt-3 grid gap-6 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function PersonFields({
  prefix,
  label,
  entry,
  compact = false
}: {
  prefix: string;
  label: string;
  entry?: Entry;
  compact?: boolean;
}) {
  return (
    <fieldset className="border border-mist p-4">
      <legend className="px-1 text-xs uppercase tracking-wide text-ink/50">{label}</legend>
      <Field label="Name">
        <input name={`${prefix}Name`} defaultValue={entry?.displayName ?? ""} className={inputClass} />
      </Field>
      <Field label="Titles (optional)">
        <input name={`${prefix}Titles`} defaultValue={entry?.titles ?? ""} className={inputClass} />
      </Field>
      {!compact && (
        <Field label="Photo URL (optional)">
          <input name={`${prefix}Photo`} defaultValue={entry?.photoUrl ?? ""} className={inputClass} />
        </Field>
      )}
    </fieldset>
  );
}

const inputClass = "mt-1 w-full border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-2 block first:mt-0">
      <span className="text-xs text-ink/60">{label}</span>
      {children}
    </label>
  );
}
