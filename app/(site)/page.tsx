import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/actions/settings";
import { formatPrice, formatAge, formatDate } from "@/lib/format";
import Button from "@/components/Button";
import RevealSection from "@/components/RevealSection";
import NewsletterForm from "@/components/NewsletterForm";

export default async function HomePage() {
  const [settings, dogs, studs, litters, announcements, posts, testimonials, program] = await Promise.all([
    getSettings(),
    prisma.dog.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } }
    }),
    prisma.stud.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } }
    }),
    prisma.litter.findMany({
      orderBy: { expectedDate: "asc" },
      take: 3,
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } }
    }),
    prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3
    }),
    prisma.testimonial.findMany({ where: { isFeatured: true }, take: 4 }),
    prisma.breedingProgram.findFirst({ where: { isFeatured: true } })
  ]);

  return (
    <>
      {/* HERO */}
      <section className="border-b border-mist bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="font-display text-lg italic text-brass">{settings.siteName}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
              Three generations of health testing behind every puppy we place.
            </h1>
            <p className="mt-6 max-w-prose text-base text-ink/70">
              We breed a small number of litters a year, screen every parent, and place each
              puppy with a family we've actually spoken with. Look through our current dogs,
              studs, and upcoming litters below.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/dogs">View dogs for sale</Button>
              <Button href="/studs" variant="secondary">Meet our studs</Button>
            </div>
          </div>

          <div className="registry-frame border border-mist bg-paperdim p-2">
            <div className="flex aspect-[4/5] items-center justify-center bg-pine/5 text-sm text-ink/40">
              Featured kennel photo
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DOGS */}
      <RevealSection>
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-ink">Dogs for sale</h2>
            <Link href="/dogs" className="text-sm text-brass hover:text-brasslight">
              View all dogs
            </Link>
          </div>

          {dogs.length === 0 ? (
            <EmptyState message="New arrivals are on the way — check back soon, or join the waitlist for our next litter." />
          ) : (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => (
                <Link
                  key={dog.id}
                  href={`/dogs/${dog.slug}`}
                  className="group border-t-2 border-brass pt-4"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-paperdim">
                    {dog.images[0] ? (
                      <Image
                        src={dog.images[0].url}
                        alt={dog.images[0].altText ?? dog.name}
                        width={480}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-ink/30">
                        Photo coming soon
                      </div>
                    )}
                  </div>
                  <p className="mt-4 font-display text-lg text-ink">{dog.name}</p>
                  <p className="text-sm text-ink/60">
                    {dog.breed} · {formatAge(dog.birthDate)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-brass">{formatPrice(dog.priceCents)}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </RevealSection>

      {/* FEATURED STUDS */}
      <RevealSection>
        <section className="border-t border-mist bg-paperdim">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-ink">Available studs</h2>
              <Link href="/studs" className="text-sm text-brass hover:text-brasslight">
                View all studs
              </Link>
            </div>

            {studs.length === 0 ? (
              <EmptyState message="Our stud roster is being updated. Reach out directly and we'll share what's available." />
            ) : (
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {studs.map((stud) => (
                  <Link
                    key={stud.id}
                    href={`/studs/${stud.slug}`}
                    className="group border-t-2 border-brass bg-paper pt-4"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-paperdim">
                      {stud.images[0] ? (
                        <Image
                          src={stud.images[0].url}
                          alt={stud.images[0].altText ?? stud.name}
                          width={480}
                          height={360}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-ink/30">
                          Photo coming soon
                        </div>
                      )}
                    </div>
                    <p className="mt-4 font-display text-lg text-ink">{stud.name}</p>
                    <p className="text-sm text-ink/60">
                      {stud.breed} · {formatAge(stud.birthDate)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-brass">
                      {formatPrice(stud.studFeeCents)} stud fee
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </RevealSection>

      {/* BREEDING SERVICES */}
      <RevealSection>
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl text-ink">Breeding services</h2>
          <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-center">
            <p className="max-w-prose text-ink/70">
              {program?.summary ??
                "We plan a limited number of litters each year around health clearances and temperament, not a calendar. Every pairing is chosen to improve on the last generation."}
            </p>
            <div>
              <Button href="/breeding" variant="secondary">Learn about our program</Button>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* UPCOMING LITTERS */}
      <RevealSection>
        <section className="border-t border-mist bg-pine text-paper">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl">Upcoming litters</h2>
              <Link href="/litters" className="text-sm text-brasslight hover:text-brass">
                View all litters
              </Link>
            </div>

            {litters.length === 0 ? (
              <p className="mt-8 max-w-prose text-paper/70">
                Nothing planned at the moment — join the waitlist and we'll let you know as soon
                as a litter is expected.
              </p>
            ) : (
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {litters.map((litter) => (
                  <div key={litter.id} className="border-t-2 border-brasslight pt-4">
                    <p className="font-display text-lg">
                      {litter.sireName} × {litter.damName}
                    </p>
                    <p className="text-sm text-paper/70">{litter.breed}</p>
                    <p className="mt-2 text-sm text-brasslight">
                      Expected {formatDate(litter.expectedDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </RevealSection>

      {/* ANNOUNCEMENTS + BLOG */}
      <RevealSection>
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl text-ink">Latest announcements</h2>
                <Link href="/announcements" className="text-sm text-brass hover:text-brasslight">
                  All announcements
                </Link>
              </div>
              {announcements.length === 0 ? (
                <EmptyState message="Nothing posted yet — announcements will appear here." compact />
              ) : (
                <ul className="mt-6 space-y-5">
                  {announcements.map((a) => (
                    <li key={a.id} className="border-b border-mist pb-5">
                      <Link href={`/announcements/${a.slug}`} className="font-medium text-ink hover:text-brass">
                        {a.title}
                      </Link>
                      <p className="mt-1 text-sm text-ink/50">{formatDate(a.publishedAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl text-ink">From the blog</h2>
                <Link href="/blog" className="text-sm text-brass hover:text-brasslight">
                  All posts
                </Link>
              </div>
              {posts.length === 0 ? (
                <EmptyState message="Our first posts are on the way." compact />
              ) : (
                <ul className="mt-6 space-y-5">
                  {posts.map((post) => (
                    <li key={post.id} className="border-b border-mist pb-5">
                      <Link href={`/blog/${post.slug}`} className="font-medium text-ink hover:text-brass">
                        {post.title}
                      </Link>
                      <p className="mt-1 text-sm text-ink/60">{post.excerpt}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <RevealSection>
          <section className="border-t border-mist bg-paperdim">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <h2 className="font-display text-3xl text-ink">What families say</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {testimonials.map((t) => (
                  <blockquote key={t.id} className="border-l-2 border-brass pl-6">
                    <p className="font-display text-lg italic text-ink">"{t.quote}"</p>
                    <footer className="mt-3 text-sm text-ink/60">
                      {t.authorName}
                      {t.location ? `, ${t.location}` : ""}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        </RevealSection>
      )}

      {/* NEWSLETTER */}
      <section className="border-t border-mist bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl">Stay ahead of new litters</h2>
            <p className="mt-2 max-w-prose text-sm text-paper/70">
              A short email when a litter is planned, born, or ready to go home — nothing else.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-t border-mist bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl text-ink">Questions about a dog, stud, or litter?</h2>
          <p className="mx-auto mt-3 max-w-prose text-ink/70">
            Send us a message and we'll get back to you within a day or two.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/contact">Contact us</Button>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState({ message, compact = false }: { message: string; compact?: boolean }) {
  return (
    <div className={`border border-dashed border-mist text-ink/50 ${compact ? "mt-6 p-6 text-sm" : "mt-8 p-12 text-center"}`}>
      {message}
    </div>
  );
}
