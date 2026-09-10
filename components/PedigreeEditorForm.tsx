interface NodeLike {
  displayName: string;
  titles?: string | null;
  photoUrl?: string | null;
}

interface ParentLike extends NodeLike {
  sire?: NodeLike | null;
  dam?: NodeLike | null;
}

export default function PedigreeEditorForm({
  action,
  subjectName,
  existing
}: {
  action: (formData: FormData) => void;
  subjectName: string;
  existing?: {
    titles?: string | null;
    sire?: ParentLike | null;
    dam?: ParentLike | null;
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
        <PersonFields prefix="dd" label="Dam's dam" entry={dam?.dam}