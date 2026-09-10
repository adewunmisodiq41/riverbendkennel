"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug, slugify } from "@/lib/slug";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
}

// ---------- Categories ----------

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required.");

  const slug = await uniqueSlug(name, async (c) => (await prisma.blogCategory.count({ where: { slug: c } })) > 0);
  await prisma.blogCategory.create({ data: { name, slug } });

  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.blogCategory.delete({ where: { id } });
  revalidatePath("/admin/blog/categories");
  revalidatePath("/blog");
}

// ---------- Posts ----------

function readPostFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    coverImage: String(formData.get("coverImage") ?? "").trim() || null,
    categoryId: String(formData.get("categoryId") ?? "").trim() || null,
    isFeatured: formData.get("isFeatured") === "on",
    publish: formData.get("publish") === "on"
  };
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const f = readPostFields(formData);
  if (!f.title || !f.excerpt || !f.body) throw new Error("Title, excerpt, and body are required.");

  const slug = await uniqueSlug(f.title, async (c) => (await prisma.blogPost.count({ where: { slug: c } })) > 0);

  if (f.isFeatured) {
    await prisma.blogPost.updateMany({ data: { isFeatured: false }, where: { isFeatured: true } });
  }

  await prisma.blogPost.create({
    data: {
      title: f.title,
      slug,
      excerpt: f.excerpt,
      body: f.body,
      coverImage: f.coverImage,
      categoryId: f.categoryId,
      isFeatured: f.isFeatured,
      isPublished: f.publish,
      publishedAt: f.publish ? new Date() : null
    }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdmin();
  const f = readPostFields(formData);
  if (!f.title || !f.excerpt || !f.body) throw new Error("Title, excerpt, and body are required.");

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found.");

  const slug =
    f.title.trim() === existing.title.trim()
      ? existing.slug
      : await uniqueSlug(f.title, async (c) => (await prisma.blogPost.count({ where: { slug: c, NOT: { id } } })) > 0);

  if (f.isFeatured) {
    await prisma.blogPost.updateMany({ data: { isFeatured: false }, where: { isFeatured: true, NOT: { id } } });
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      title: f.title,
      slug,
      excerpt: f.excerpt,
      body: f.body,
      coverImage: f.coverImage,
      categoryId: f.categoryId,
      isFeatured: f.isFeatured,
      isPublished: f.publish,
      publishedAt: f.publish ? existing.publishedAt ?? new Date() : null
    }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
}

// exported for potential reuse (not currently called directly by a form)
export { slugify };
