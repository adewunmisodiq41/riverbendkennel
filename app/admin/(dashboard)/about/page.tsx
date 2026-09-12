import { prisma } from "@/lib/prisma";
import { saveAboutPage } from "@/lib/actions/about";

export default async function AdminAboutPage() {
  const about = await prisma.aboutPage.findUnique({ where: { id: "about" } });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">About Us page</h1>
      <p className="mt-1 text-sm text-ink/60">This is what visitors see on your public About Us page.</p>

      <div className="mt-8 max-w-2xl bg-paper p-8">
        <form action={saveAboutPage} className="space-y-6">
          <Field label="Heading">
            <input name="heading" required defaultValue={about?.heading ?? ""} className={inputClass} />
          </Field>

          <Field label="Story / body text">
            <textarea name="body" rows={12} required defaultValue={about?.body ?? ""} className={inputClass} />
          </Field>

          <Field label="Photo URL (optional)">
            <input name="photoUrl" defaultValue={about?.photoUrl ?? ""} className={inputClass} />
          </Field>

          <button type="submit" className="bg-pine px-6 py-3 text-sm font-medium text-paper hover:bg-ink">
            Save
          </button>
        </form>
      </div>
    </div>
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
