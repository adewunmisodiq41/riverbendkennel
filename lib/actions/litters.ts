"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { LitterStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
}

function readFields(formData: FormData) {
  const sireName = String(formData.get("sireName") ?? "").trim();
  const damName = String(formData.get("damName") ?? "").trim();
  const breed = String(formData.get("breed") ?? "").trim();
  const expectedDateRaw = String(formData.get("expectedDate") ?? "");
  const bornDateRaw = String(formData.get("bornDate") ?? "");
  const status = String(formData.get("status") ?? "PLANNED") as LitterStatus;
  const description = String(formData.get("description") ?? "").trim() || null;

  const imageUrls = formData.getAll("imageUrl").map((v) => String(v).trim());
  const imageAlts = formData.getAll("imageAlt").map((v) => String(v).trim());
  const images = imageUrls
    .map((url, i) => ({ url, altText: imageAlts[i] || null }))
    .filter((img) => img.url.length > 0)
    .map((img, i) => ({ ...img, sortOrder: i }));

  return {
    sireName,
    damName,
    breed,
    expectedDate: expectedDateRaw ? new Date(expectedDateRaw) : null,
    bornDate: bornDateRaw ? new Date(bornDateRaw) : null,
    status,
    description,
    images
  };
}

export async function createLitter(formData: FormData) {
  await requireAdmin();
  const f = readFields(formData);
  if (!f.sireName || !f.damName || !f.breed) throw new Error("Sire, dam, and breed are required.");

  await prisma.litter.create({ data: { ...f, images: { create: f.images } } });

  revalidatePath("/admin/litters");
  revalidatePath("/litters");
  revalidatePath("/");
  redirect("/admin/litters");
}

export async function updateLitter(id: string, formData: FormData) {
  await requireAdmin();
  const f = readFields(formData);
  if (!f.sireName || !f.damName || !f.breed) throw new Error("Sire, dam, and breed are required.");

  await prisma.$transaction([
    prisma.image.deleteMany({ where: { litterId: id } }),
    prisma.litter.update({ where: { id }, data: { ...f, images: { create: f.images } } })
  ]);

  revalidatePath("/admin/litters");
  revalidatePath("/litters");
  revalidatePath("/");
  redirect("/admin/litters");
}

export async function deleteLitter(id: string) {
  await requireAdmin();
  await prisma.litter.delete({ where: { id } });
  revalidatePath("/admin/litters");
  revalidatePath("/litters");
  revalidatePath("/");
}

export async function deleteWaitlistEntry(id: string) {
  await requireAdmin();
  await prisma.waitlistEntry.delete({ where: { id } });
  revalidatePath("/admin/waitlist");
}
