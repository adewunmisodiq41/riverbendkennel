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

export async function saveAboutPage(formData: FormData) {
  await requireAdmin();

  const heading = String(formData.get("heading") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;

  if (!heading || !body) throw new Error("Heading and body are required.");

  await prisma.aboutPage.upsert({
    where: { id: "about" },
    update: { heading, body, photoUrl },
    create: { id: "about", heading, body, photoUrl }
  });

  revalidatePath("/admin/about");
  revalidatePath("/about");
}
