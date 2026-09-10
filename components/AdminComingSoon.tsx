export default function AdminComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">{title}</h1>
      <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-sm text-ink/60">
        {note}
      </div>
    </div>
  );
}
