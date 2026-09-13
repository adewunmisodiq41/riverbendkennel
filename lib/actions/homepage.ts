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

export async function getHomepageContent() {
  const content = await prisma.homepageContent.findUnique({ where: { id: "homepage" } });
  return (
    content ?? {
      heroHeadline: "Three generations of health testing behind every puppy we place.",
      heroSubtext:
        "We breed a small number of litters a year, screen every parent, and place each puppy with a family we've actually spoken with. Look through our current dogs, studs, and upcoming litters below.",
      heroPhotoUrl: null as string | null
    }
  );
}

export async function saveHomepageContent(formData: FormData) {
  await requireAdmin();

  const heroHeadline = String(formData.get("heroHeadline") ?? "").trim();
  const heroSubtext = String(formData.get("heroSubtext") ?? "").trim();
  const heroPhotoUrl = String(formData.get("heroPhotoUrl") ?? "").trim() || null;

  if (!heroHeadline || !heroSubtext) throw new Error("Headline and subtext are required.");

  await prisma.homepageContent.upsert({
    where: { id: "homepage" },
    update: { heroHeadline, heroSubtext, heroPhotoUrl },
    create: { id: "homepage", heroHeadline, heroSubtext, heroPhotoUrl }
  });

  revalidatePath("/");
  revalidatePath("/admin/homepage");
}
