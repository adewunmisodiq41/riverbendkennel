interface NodeLike {
  displayName: string;
  titles?: string | null;
  photoUrl?: string | null;
}

interface ParentLike extends NodeLike {
  sire?: NodeLike | null;
  dam?: NodeLike | null;
}

export default function PedigreeTree({
  root
}: {
  root: {
    displayName: string;
    titles?: string | null;
    sire?: ParentLike | null;
    dam?: ParentLike | null;
  };
}) {
  const sire = root.sire ?? null;
  const dam = root.dam ?? null;

  return (
    <div className="grid grid-cols-3 gap-3" style={{ gridTemplateRows: "repeat(4, minmax(0, 1fr))" }}>
      <Cell entry={sire?.sire ?? null} style={{ gridColumn: 1, gridRow: 1 }} />
      <Cell entry={sire?.dam ?? null} style={{ gridColumn: 1, gridRow: 2 }} />
      <Cell entry={dam?.sire ?? null} style={{ gridColumn: 1, gridRow: 3 }} />
      <Cell entry={dam?.dam ?? null} style={{ gridColumn: 1, gridRow: 4 }} />

      <Cell entry={sire} style={{ gridColumn: 2, gridRow: "1 / span 2" }} emphasis />
      <Cell entry={dam} style={{ gridColumn: 2, gridRow: "3 / span 2" }} emphasis />

      <Cell
        entry={{ displayName: root.displayName, titles: root.titles }}
        style={{ gridColumn: 3, gridRow: "1 / span 4" }}
        emphasis
        isRoot
      />
    </div>
  );
}

function Cell({
  entry,
  style,
  emphasis = false,
  isRoot = false
}: {
  entry?: NodeLike | null;
  style: React.CSSProperties;
  emphasis?: boolean;
  isRoot?: boolean;
}) {
  return (
    <div
      style={style}
      className={`flex min-h-[3.5rem] flex-col justify-center border p-3 ${
        isRoot ? "border-brass bg-brass/10" : emphasis ? "border-ink/20 bg-paper" : "border-mist bg-paperdim"
      }`}
    >
      {entry ? (
        <>
          <p className={`font-display ${isRoot ? "text-lg" : "text-sm"} text-ink`}>{entry.displayName}</p>
          {entry.titles && <p className="mt-0.5 text-xs text-ink/50">{entry.titles}</p>}
        </>
      ) : (
        <p className="text-xs text-ink/30">Unknown</p>
      )}
    </div>
  );
}