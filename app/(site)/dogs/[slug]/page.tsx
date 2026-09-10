import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatAge, formatDate } from "@/lib/format";
import PhotoGallery from "@/components/PhotoGallery";
import InquiryForm from "@/components/InquiryForm";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const dog = await prisma.dog.findUnique({ where: { slug: params.slug } });
  return { title: dog ? dog.name : "Dog" };
}

export default async function DogDetailPage({ params }: { params: { slug: string } }) {
  const dog = await prisma.dog.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      pedigree: true
    }
  });

  if (!dog) notFound();

  const statusLabel =
    dog.status === "AVAILABLE" ? "Available" : dog.status === "RESERVED" ? "Reserved" : "Sold";

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/dogs" className="text-sm text-brass hover:text-brasslight">
        ← All dogs
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <PhotoGallery images={dog.images} alt={dog.name} />

        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-ink">{dog.name}</h1>
            <span
              className={`px-2 py-1 text-xs uppercase tracking-wide ${
                dog.status === "AVAILABLE" ? "bg-brass/15 text-brass" : "bg-ink/10 text-ink/60"
              }`}
            >
              {statusLabel}
            </span>
          </div>
          <p className="mt-1 text-ink/60">
            {dog.breed} · {dog.gender === "MALE" ? "Male" : "Female"} · {formatAge(dog.birthDate)}
          </p>
          <p className="mt-4 font-display text-2xl text-brass">{formatPrice(dog.priceCents)}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-mist py-6 text-sm">
            {dog.color && (
              <div>
                <dt className="text-ink/50">Color</dt>
                <dd className="text-ink">{dog.color}</dd>
              </div>
            )}
            {dog.weightLbs != null && (
              <div>
                <dt className="text-ink/50">Weight</dt>
                <dd className="text-ink">{dog.weightLbs} lbs</dd>
              </div>
            )}
            <div>
              <dt className="text-ink/50">Born</dt>
              <dd className="text-ink">{formatDate(dog.birthDate)}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Pedigree</dt>
              <dd className="text-ink">
                {dog.pedigree ? (
                  <Link href={`/pedigree/${dog.slug}`} className="text-brass hover:text-brasslight">
                    View family tree
                  </Link>
                ) : (
                  "Coming soon"
                )}
              </dd>
            </div>
          </dl>

          {dog.description && (
            <div className="mt-6">
              <h2 className="font-display text-lg text-ink">About {dog.name}</h2>
              <p className="mt-2 whitespace-pre-line text-ink/70">{dog.description}</p>
            </div>
          )}

          {dog.healthNotes && (
            <div className="mt-6">
              <h2 className="font-display text-lg text-ink">Health</h2>
              <p className="mt-2 whitespace-pre-line text-ink/70">{dog.healthNotes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-xl border-t border-mist pt-10">
        <h2 className="font-display text-2xl text-ink">Interested in {dog.name}?</h2>
        <p className="mt-2 text-sm text-ink/60">
          Send us a message and we'll follow up with next steps.
        </p>
        <div className="mt-6">
          <InquiryForm type="DOG" dogId={dog.id} subjectLabel={dog.name} />
        </div>
      </div>
    </section>
  );
}
