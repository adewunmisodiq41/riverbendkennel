"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();

  const siteName = String(formData.get("siteName") ?? "").trim();
  const logoUrl = String(formData.get("logoUrl") ?? "").trim() || null;

  if (!siteName) throw new Error("Business name is required.");

  await prisma.settings.upsert({
    where: { id: "settings" },
    update: { siteName, logoUrl },
    create: { id: "settings", siteName, logoUrl }
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

export async function getSettings() {
  const settings = await prisma.settings.findUnique({ where: { id: "settings" } });
  return settings ?? { siteName: "My Kennel", logoUrl: null as string | null };
}
