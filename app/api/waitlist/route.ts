import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  litterId: z.string().optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in every required field correctly." }, { status: 400 });
  }

  const { name, email, phone, notes, litterId } = parsed.data;

  await prisma.waitlistEntry.create({
    data: { name, email, phone: phone || null, notes: notes || null, litterId: litterId || null }
  });

  return NextResponse.json({ ok: true });
}
