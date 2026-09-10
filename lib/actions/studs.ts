"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
}

function readStudFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const breed = String(formData.get("breed") ?? "").trim();
  const birthDateRaw = String(formData.get("birthDate") ?? "");
  const color = String(formData.get("color") ?? "").trim() || null;
  const weightRaw = String(formData.get("weightLbs") ?? "").trim();
  const feeRaw = String(formData.get("studFeeDollars") ?? "").trim();
  const isAvailable = formData.get("isAvailable") === "on";
  const healthInfo = String(formData.get("healthInfo") ?? "").trim() || null;
  const achievements = String(formData.get("achievements") ?? "").trim() || null;

  const imageUrls = formData.getAll("imageUrl").map((v) => String(v).trim());
  const imageAlts = formData.getAll("imageAlt").map((v) => String(v).trim());
  const images = imageUrls
    .map((url, i) => ({ url, altText: imageAlts[i] || null }))
    .filter((img) => img.url.length > 0)
    .map((img, i) => ({ ...img, sortOrder: i }));

  return {
    name,
    breed,
    birthDate: birthDateRaw ? new Date(birthDateRaw) : null,
    color,
    weightLbs: weightRaw ? parseFloat(weightRaw) : null,
    studFeeCents: feeRaw ? Math.round(parseFloat(feeRaw) * 100) : null,
    isAvailable,
    healthInfo,
    achievements,
    images
  };
}

export async function createStud(formData: FormData) {
  await requireAdmin();
  const fields = readStudFields(formData);
  if (!fields.name || !fields.breed) throw new Error("Name and breed are required.");

  const slug = await uniqueSlug(
    fields.name,
    async (candidate) => (await prisma.stud.count({ where: { slug: candidate } })) > 0
  );

  await prisma.stud.create({
    data: { ...fields, slug, images: { create: fields.images } }
  });

  revalidatePath("/admin/studs");
  revalidatePath("/studs");
  revalidatePath("/");
  redirect("/admin/studs");
}

export async function updateStud(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readStudFields(formData);
  if (!fields.name || !fields.breed) throw new Error("Name and breed are required.");

  const existing = await prisma.stud.findUnique({ where: { id } });
  if (!existing) throw new Error("Stud not found.");

  const slug =
    fields.name.trim() === existing.name.trim()
      ? existing.slug
      : await uniqueSlug(
          fields.name,
          async (candidate) =>
            (await prisma.stud.count({ where: { slug: candidate, NOT: { id } } })) > 0
        );

  await prisma.$transaction([
    prisma.image.deleteMany({ where: { studId: id } }),
    prisma.stud.update({
      where: { id },
      data: { ...fields, slug, images: { create: fields.images } }
    })
  ]);

  revalidatePath("/admin/studs");
  revalidatePath("/studs");
  revalidatePath(`/studs/${slug}`);
  revalidatePath("/");
  redirect("/admin/studs");
}

export async function deleteStud(id: string) {
  await requireAdmin();
  await prisma.stud.delete({ where: { id } });
  revalidatePath("/admin/studs");
  revalidatePath("/studs");
  revalidatePath("/");
}

export async function setStudAvailability(id: string, isAvailable: boolean) {
  await requireAdmin();
  await prisma.stud.update({ where: { id }, data: { isAvailable } });
  revalidatePath("/admin/studs");
  revalidatePath("/studs");
  revalidatePath("/");
}

export async function toggleStudAvailabilityFromForm(formData: FormData) {
  const id = String(formData.get("id"));
  const isAvailable = String(formData.get("isAvailable")) === "true";
  await setStudAvailability(id, isAvailable);
}
