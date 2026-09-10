"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  return session;
}

export async function createAdmin(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) throw new Error("Name, email, and password are all required.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) throw new Error("An admin with that email already exists.");

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.create({
    data: { name, email, passwordHash, role: "ADMIN" }
  });

  revalidatePath("/admin/settings/admins");
}

export async function deleteAdmin(id: string) {
  const session = await requireAdmin();

  const total = await prisma.adminUser.count();
  if (total <= 1) {
    throw new Error("You can't delete the only remaining admin.");
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (target && session.user?.email === target.email) {
    throw new Error("You can't delete your own account while signed in as it.");
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/settings/admins");
}
