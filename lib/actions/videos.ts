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

function readFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim() || null;
  const durationRaw = String(formData.get("durationSeconds") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  return {
    title,
    description,
    videoUrl,
    thumbnailUrl,
    durationSeconds: durationRaw ? Math.round(parseFloat(durationRaw)) : null,
    isActive
  };
}

export async function createVideo(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  if (!fields.title || !fields.videoUrl) {
    throw new Error("Title and a video file are required.");
  }

  const last = await prisma.video.findFirst({ orderBy: { sortOrder: "desc" } });
  const sortOrder = (last?.sortOrder ?? -1) + 1;

  await prisma.video.create({ data: { ...fields, sortOrder } });

  revalidatePath("/admin/videos");
  revalidatePath("/");
  redirect("/admin/videos");
}

export async function updateVideo(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  if (!fields.title || !fields.videoUrl) {
    throw new Error("Title and a video file are required.");
  }

  await prisma.video.update({ where: { id }, data: fields });

  revalidatePath("/admin/videos");
  revalidatePath("/");
  redirect("/admin/videos");
}

export async function deleteVideo(id: string) {
  await requireAdmin();
  await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  revalidatePath("/");
}

export async function toggleVideoActiveFromForm(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const isActive = String(formData.get("isActive")) === "true";
  await prisma.video.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/videos");
  revalidatePath("/");
}

export async function moveVideo(id: string, direction: "up" | "down") {
  await requireAdmin();

  const videos = await prisma.video.findMany({ orderBy: { sortOrder: "asc" } });
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= videos.length) return;

  const a = videos[index];
  const b = videos[swapIndex];

  await prisma.$transaction([
    prisma.video.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.video.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } })
  ]);

  revalidatePath("/admin/videos");
  revalidatePath("/");
}
