import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import { getSettings } from "@/lib/actions/settings";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const settings = await getSettings();

  return (
    <div className="flex min-h-screen bg-paperdim">
      <AdminSidebar userName={session.user?.name} siteName={settings.siteName} />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-5xl px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
