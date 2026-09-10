"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import type { DogGender, DogStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }
}

function readDogFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const breed = String(formData.get("breed") ?? "").trim();
  const gender = String(formData.get("gender") ?? "MALE") as DogGender;
  const birthDateRaw = String(formData.get("birthDate") ?? "");
  const color = String(formData.get("color") ?? "").trim() || null;
  const weightRaw = String(formData.get("weightLbs") ?? "").trim();
  const priceRaw = String(formData.get("priceDollars") ?? "").trim();
  const status = String(formData.get("status") ?? "AVAILABLE") as DogStatus;
  const description = String(formData.get("description") ?? "").trim() || null;
  const healthNotes = String(formData.get("healthNotes") ?? "").trim() || null;

  const imageUrls = formData.getAll("imageUrl").map((v) => String(v).trim());
  const imageAlts = formData.getAll("imageAlt").map((v) => String(v).trim());
  const images = imageUrls
    .map((url, i) => ({ url, altText: imageAlts[i] || null }))
    .filter((img) => img.url.length > 0)
    .map((img, i) => ({ ...img, sortOrder: i }));

  return {
    name,
    breed,
    gender,
    birthDate: birthDateRaw ? new Date(birthDateRaw) : null,
    color,
    weightLbs: weightRaw ? parseFloat(weightRaw) : null,
    priceCents: priceRaw ? Math.round(parseFloat(priceRaw) * 100) : null,
    status,
    description,
    healthNotes,
    images
  };
}

export async function createDog(formData: FormData) {
  await requireAdmin();
  const fields = readDogFields(formData);

  if (!fields.name || !fields.breed) {
    throw new Error("Name and breed are required.");
  }

  const slug = await uniqueSlug(
    fields.name,
    async (candidate) => (await prisma.dog.count({ where: { slug: candidate } })) > 0
  );

  await prisma.dog.create({
    data: {
      name: fields.name,
      slug,
      breed: fields.breed,
      gender: fields.gender,
      birthDate: fields.birthDate,
      color: fields.color,
      weightLbs: fields.weightLbs,
      priceCents: fields.priceCents,
      status: fields.status,
      description: fields.description,
      healthNotes: fields.healthNotes,
      images: { create: fields.images }
    }
  });

  revalidatePath("/admin/dogs");
  revalidatePath("/dogs");
  revalidatePath("/");
  redirect("/admin/dogs");
}

export async function updateDog(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readDogFields(formData);

  if (!fields.name || !fields.breed) {
    throw new Error("Name and breed are required.");
  }

  const existing = await prisma.dog.findUnique({ where: { id } });
  if (!existing) throw new Error("Dog not found.");

  const slug =
    fields.name.trim() === existing.name.trim()
      ? existing.slug
      : await uniqueSlug(
          fields.name,
          async (candidate) =>
            (await prisma.dog.count({ where: { slug: candidate, NOT: { id } } })) > 0
        );

  await prisma.$transaction([
    prisma.image.deleteMany({ where: { dogId: id } }),
    prisma.dog.update({
      where: { id },
      data: {
        name: fields.name,
        slug,
        breed: fields.breed,
        gender: fields.gender,
        birthDate: fields.birthDate,
        color: fields.color,
        weightLbs: fields.weightLbs,
        priceCents: fields.priceCents,
        status: fields.status,
        description: fields.description,
        healthNotes: fields.healthNotes,
        images: { create: fields.images }
      }
    })
  ]);

  revalidatePath("/admin/dogs");
  revalidatePath("/dogs");
  revalidatePath(`/dogs/${slug}`);
  revalidatePath("/");
  redirect("/admin/dogs");
}

export async function deleteDog(id: string) {
  await requireAdmin();
  await prisma.dog.delete({ where: { id } });
  revalidatePath("/admin/dogs");
  revalidatePath("/dogs");
  revalidatePath("/");
}

export async function setDogStatus(id: string, status: DogStatus) {
  await requireAdmin();
  await prisma.dog.update({ where: { id }, data: { status } });
  revalidatePath("/admin/dogs");
  revalidatePath("/dogs");
  revalidatePath("/");
}

export async function updateDogStatusFromForm(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as DogStatus;
  await setDogStatus(id, status);
}
