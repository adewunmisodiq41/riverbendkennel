import { getSettings, saveSettings } from "@/lib/actions/settings";
import LogoUpload from "@/components/LogoUpload";

export default async function AdminBrandingPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Branding</h1>
      <p className="mt-1 text-sm text-ink/60">
        Your business name and logo, used across the site and as the browser tab icon.
      </p>

      <div className="mt-8 max-w-xl bg-paper p-8">
        <form action={saveSettings} className="space-y-6">
          <Field label="Business name">
            <input name="siteName" required defaultValue={settings.siteName} className={inputClass} />
          </Field>

          <LogoUpload initialUrl={settings.logoUrl} />

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
