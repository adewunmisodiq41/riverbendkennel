import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "About us" };

export default async function AboutPage() {
  const about = await prisma.aboutPage.findUnique({ where: { id: "about" } });

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">{about?.heading ?? "About us"}</h1>

      {about?.photoUrl && (
        <div className="mt-8 aspect-[16/9] overflow-hidden bg-paperdim">
          <Image
            src={about.photoUrl}
            alt={about.heading}
            width={900}
            height={506}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {about?.body ? (
        <div className="mt-8 whitespace-pre-line leading-relaxed text-ink/80">{about.body}</div>
      ) : (
        <div className="mt-10 border border-dashed border-mist p-12 text-center text-ink/50">
          Our story is coming soon.
        </div>
      )}
    </section>
  );
}
