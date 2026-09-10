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

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    sireId: String(formData.get("sireId") ?? "").trim() || null,
    damId: String(formData.get("damId") ?? "").trim() || null,
    isFeatured: formData.get("isFeatured") === "on",
    publish: formData.get("publish") === "on"
  };
}

export async function createBreedingProgram(formData: FormData) {
  await requireAdmin();
  const f = readFields(formData);
  if (!f.title || !f.summary) throw new Error("Title and summary are required.");

  const slug = await uniqueSlug(
    f.title,
    async (c) => (await prisma.breedingProgram.count({ where: { slug: c } })) > 0
  );

  if (f.isFeatured) {
    await prisma.breedingProgram.updateMany({ data: { isFeatured: false }, where: { isFeatured: true } });
  }

  await prisma.breedingProgram.create({
    data: {
      title: f.title,
      slug,
      summary: f.summary,
      body: f.body,
      sireId: f.sireId,
      damId: f.damId,
      isFeatured: f.isFeatured,
      publishedAt: f.publish ? new Date() : null
    }
  });

  revalidatePath("/admin/breeding");
  revalidatePath("/breeding");
  revalidatePath("/");
  redirect("/admin/breeding");
}

export async function updateBreedingProgram(id: string, formData: FormData) {
  await requireAdmin();
  const f = readFields(formData);
  if (!f.title || !f.summary) throw new Error("Title and summary are required.");

  const existing = await prisma.breedingProgram.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found.");

  const slug =
    f.title.trim() === existing.title.trim()
      ? existing.slug
      : await uniqueSlug(
          f.title,
          async (c) => (await prisma.breedingProgram.count({ where: { slug: c, NOT: { id } } })) > 0
        );

  if (f.isFeatured) {
    await prisma.breedingProgram.updateMany({
      data: { isFeatured: false },
      where: { isFeatured: true, NOT: { id } }
    });
  }

  await prisma.breedingProgram.update({
    where: { id },
    data: {
      title: f.title,
      slug,
      summary: f.summary,
      body: f.body,
      sireId: f.sireId,
      damId: f.damId,
      isFeatured: f.isFeatured,
      publishedAt: f.publish ? existing.publishedAt ?? new Date() : null
    }
  });

  revalidatePath("/admin/breeding");
  revalidatePath("/breeding");
  revalidatePath(`/breeding/${slug}`);
  revalidatePath("/");
  redirect("/admin/breeding");
}

export async function deleteBreedingProgram(id: string) {
  await requireAdmin();
  await prisma.breedingProgram.delete({ where: { id } });
  revalidatePath("/admin/breeding");
  revalidatePath("/breeding");
  revalidatePath("/");
}
