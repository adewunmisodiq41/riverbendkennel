import { getHomepageContent, saveHomepageContent } from "@/lib/actions/homepage";
import LogoUpload from "@/components/LogoUpload";

export default async function AdminHomepagePage() {
  const content = await getHomepageContent();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Homepage content</h1>
      <p className="mt-1 text-sm text-ink/60">
        Edit the hero headline, subtext, and photo shown at the top of your homepage.
      </p>

      <div className="mt-8 max-w-2xl bg-paper p-8">
        <form action={saveHomepageContent} className="space-y-6">
          <Field label="Hero headline">
            <textarea
              name="heroHeadline"
              rows={2}
              required
              defaultValue={content.heroHeadline}
              className={inputClass}
            />
          </Field>

          <Field label="Hero subtext">
            <textarea
              name="heroSubtext"
              rows={4}
              required
              defaultValue={content.heroSubtext}
              className={inputClass}
            />
          </Field>

          <LogoUpload initialUrl={content.heroPhotoUrl} label="Hero photo" fieldName="heroPhotoUrl" />

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
