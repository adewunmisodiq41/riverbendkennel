export default function PageComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <p className="mx-auto mt-4 max-w-prose text-ink/60">{note}</p>
    </section>
  );
}
