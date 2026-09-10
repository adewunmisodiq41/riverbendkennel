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

function str(formData: FormData, key: string) {
  const v = String(formData.get(key) ?? "").trim();
  return v || undefined;
}

export async function savePedigree(subjectType: "DOG" | "STUD", subjectId: string, formData: FormData) {
  await requireAdmin();

  const subject =
    subjectType === "DOG"
      ? await prisma.dog.findUnique({ where: { id: subjectId } })
      : await prisma.stud.findUnique({ where: { id: subjectId } });
  if (!subject) throw new Error("Not found.");

  const rootTitles = str(formData, "rootTitles");
  const sireName = str(formData, "sireName");
  const sireTitles = str(formData, "sireTitles");
  const sirePhoto = str(formData, "sirePhoto");
  const damName = str(formData, "damName");
  const damTitles = str(formData, "damTitles");
  const damPhoto = str(formData, "damPhoto");
  const ssName = str(formData, "ssName"); // sire's sire
  const ssTitles = str(formData, "ssTitles");
  const sdName = str(formData, "sdName"); // sire's dam
  const sdTitles = str(formData, "sdTitles");
  const dsName = str(formData, "dsName"); // dam's sire
  const dsTitles = str(formData, "dsTitles");
  const ddName = str(formData, "ddName"); // dam's dam
  const ddTitles = str(formData, "ddTitles");

  // Remove any existing tree for this subject before rebuilding it.
  const existing =
    subjectType === "DOG"
      ? await prisma.pedigreeEntry.findUnique({ where: { dogId: subjectId } })
      : await prisma.pedigreeEntry.findUnique({ where: { studId: subjectId } });

  if (existing) {
    const [sireEntry, damEntry] = await Promise.all([
      existing.sireId ? prisma.pedigreeEntry.findUnique({ where: { id: existing.sireId } }) : null,
      existing.damId ? prisma.pedigreeEntry.findUnique({ where: { id: existing.damId } }) : null
    ]);
    const grandparentIds = [sireEntry?.sireId, sireEntry?.damId, damEntry?.sireId, damEntry?.damId].filter(
      (v): v is string => !!v
    );
    const parentIds = [existing.sireId, existing.damId].filter((v): v is string => !!v);

    if (grandparentIds.length) await prisma.pedigreeEntry.deleteMany({ where: { id: { in: grandparentIds } } });
    if (parentIds.length) await prisma.pedigreeEntry.deleteMany({ where: { id: { in: parentIds } } });
    await prisma.pedigreeEntry.delete({ where: { id: existing.id } });
  }

  async function maybeCreate(name?: string, titles?: string, photoUrl?: string) {
    if (!name) return null;
    const entry = await prisma.pedigreeEntry.create({
      data: { displayName: name, titles: titles ?? null, photoUrl: photoUrl ?? null }
    });
    return entry.id;
  }

  const ssId = await maybeCreate(ssName, ssTitles);
  const sdId = await maybeCreate(sdName, sdTitles);
  const dsId = await maybeCreate(dsName, dsTitles);
  const ddId = await maybeCreate(ddName, ddTitles);

  const sireId = sireName
    ? (
        await prisma.pedigreeEntry.create({
          data: { displayName: sireName, titles: sireTitles ?? null, photoUrl: sirePhoto ?? null, sireId: ssId, damId: sdId }
        })
      ).id
    : null;

  const damId = damName
    ? (
        await prisma.pedigreeEntry.create({
          data: { displayName: damName, titles: damTitles ?? null, photoUrl: damPhoto ?? null, sireId: dsId, damId: ddId }
        })
      ).id
    : null;

  await prisma.pedigreeEntry.create({
    data: {
      displayName: subject.name,
      titles: rootTitles ?? null,
      dogId: subjectType === "DOG" ? subjectId : null,
      studId: subjectType === "STUD" ? subjectId : null,
      sireId,
      damId
    }
  });

  revalidatePath("/admin/pedigree");
  revalidatePath(`/pedigree/${subject.slug}`);
  revalidatePath(subjectType === "DOG" ? `/dogs/${subject.slug}` : `/studs/${subject.slug}`);
  redirect("/admin/pedigree");
}
