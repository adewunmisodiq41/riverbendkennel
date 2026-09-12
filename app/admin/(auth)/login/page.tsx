import LoginForm from "@/components/LoginForm";
import { getSettings } from "@/lib/actions/settings";

export default async function AdminLoginPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="font-display text-2xl text-ink">{settings.siteName}</p>
        <p className="mt-1 text-sm text-ink/60">Admin dashboard</p>
        <LoginForm />
      </div>
    </div>
  );
}
