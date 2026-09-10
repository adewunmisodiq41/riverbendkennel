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
    body: String(formData.get("body") ?? "").trim(),
    publish: formData.get("publish") === "on"
  };
}

export async function createAnnouncement(formData: FormData) {
  await requireAdmin();
  const f = readFields(formData);
  if (!f.title || !f.body) throw new Error("Title and body are required.");

  const slug = await uniqueSlug(
    f.title,
    async (c) => (await prisma.announcement.count({ where: { slug: c } })) > 0
  );

  await prisma.announcement.create({
    data: { title: f.title, slug, body: f.body, isPublished: f.publish, publishedAt: f.publish ? new Date() : null }
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/admin/announcements");
}

export async function updateAnnouncement(id: string, formData: FormData) {
  await requireAdmin();
  const f = readFields(formData);
  if (!f.title || !f.body) throw new Error("Title and body are required.");

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found.");

  const slug =
    f.title.trim() === existing.title.trim()
      ? existing.slug
      : await uniqueSlug(
          f.title,
          async (c) => (await prisma.announcement.count({ where: { slug: c, NOT: { id } } })) > 0
        );

  await prisma.announcement.update({
    where: { id },
    data: {
      title: f.title,
      slug,
      body: f.body,
      isPublished: f.publish,
      publishedAt: f.publish ? existing.publishedAt ?? new Date() : null
    }
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath(`/announcements/${slug}`);
  revalidatePath("/");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");
}
