import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional().or(z.literal("")),
  message: z.string().min(1).max(4000),
  type: z.enum(["DOG", "STUD", "BREEDING", "GENERAL"]).default("GENERAL"),
  dogId: z.string().optional(),
  studId: z.string().optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in every required field correctly." }, { status: 400 });
  }

  const { name, email, phone, message, type, dogId, studId } = parsed.data;

  await prisma.inquiry.create({
    data: {
      name,
      email,
      phone: phone || null,
      message,
      type,
      dogId: dogId || null,
      studId: studId || null
    }
  });

  return NextResponse.json({ ok: true });
}
