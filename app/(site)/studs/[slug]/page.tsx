import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatAge, formatDate } from "@/lib/format";
import PhotoGallery from "@/components/PhotoGallery";
import InquiryForm from "@/components/InquiryForm";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const stud = await prisma.stud.findUnique({ where: { slug: params.slug } });
  return { title: stud ? stud.name : "Stud" };
}

export default async function StudDetailPage({ params }: { params: { slug: string } }) {
  const stud = await prisma.stud.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      pedigree: true
    }
  });

  if (!stud) notFound();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/studs" className="text-sm text-brass hover:text-brasslight">
        ← All studs
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <PhotoGallery images={stud.images} alt={stud.name} />

        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-ink">{stud.name}</h1>
            <span
              className={`px-2 py-1 text-xs uppercase tracking-wide ${
                stud.isAvailable ? "bg-brass/15 text-brass" : "bg-ink/10 text-ink/60"
              }`}
            >
              {stud.isAvailable ? "Available" : "Not available"}
            </span>
          </div>
          <p className="mt-1 text-ink/60">
            {stud.breed} · {formatAge(stud.birthDate)}
          </p>
          <p className="mt-4 font-display text-2xl text-brass">{formatPrice(stud.studFeeCents)} stud fee</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-mist py-6 text-sm">
            {stud.color && (
              <div>
                <dt className="text-ink/50">Color</dt>
                <dd className="text-ink">{stud.color}</dd>
              </div>
            )}
            {stud.weightLbs != null && (
              <div>
                <dt className="text-ink/50">Weight</dt>
                <dd className="text-ink">{stud.weightLbs} lbs</dd>
              </div>
            )}
            <div>
              <dt className="text-ink/50">Born</dt>
              <dd className="text-ink">{formatDate(stud.birthDate)}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Pedigree</dt>
              <dd className="text-ink">
                {stud.pedigree ? (
                  <Link href={`/pedigree/${stud.slug}`} className="text-brass hover:text-brasslight">
                    View family tree
                  </Link>
                ) : (
                  "Coming soon"
                )}
              </dd>
            </div>
          </dl>

          {stud.achievements && (
            <div className="mt-6">
              <h2 className="font-display text-lg text-ink">Achievements &amp; titles</h2>
              <p className="mt-2 whitespace-pre-line text-ink/70">{stud.achievements}</p>
            </div>
          )}

          {stud.healthInfo && (
            <div className="mt-6">
              <h2 className="font-display text-lg text-ink">Health information</h2>
              <p className="mt-2 whitespace-pre-line text-ink/70">{stud.healthInfo}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-xl border-t border-mist pt-10">
        <h2 className="font-display text-2xl text-ink">Book {stud.name}</h2>
        <p className="mt-2 text-sm text-ink/60">
          Send us a message with your female's details and we'll follow up.
        </p>
        <div className="mt-6">
          <InquiryForm type="STUD" studId={stud.id} subjectLabel={stud.name} />
        </div>
      </div>
    </section>
  );
}
