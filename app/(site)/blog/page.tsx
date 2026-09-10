import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Blog" };

type SearchParams = { category?: string; q?: string };

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const categorySlug = searchParams.category && searchParams.category !== "ALL" ? searchParams.category : undefined;
  const q = searchParams.q?.trim();

  const where: Prisma.BlogPostWhereInput = { isPublished: true };
  if (categorySlug) where.category = { slug: categorySlug };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { body: { contains: q, mode: "insensitive" } }
    ];
  }

  const [featured, posts, categories] = await Promise.all([
    !categorySlug && !q
      ? prisma.blogPost.findFirst({ where: { isPublished: true, isFeatured: true }, include: { category: true } })
      : null,
    prisma.blogPost.findMany({ where, orderBy: { publishedAt: "desc" }, include: { category: true } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } })
  ]);

  const listedPosts = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Blog</h1>
      <p className="mt-2 text-ink/60">Notes from the kennel on breeding, health, and raising puppies.</p>

      <div className="mt-8 flex flex-col gap-3 border-y border-mist py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`px-3 py-1.5 text-sm ${!categorySlug ? "bg-pine text-paper" : "border border-mist text-ink/70 hover:border-brass"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/blog?category=${c.slug}`}
              className={`px-3 py-1.5 text-sm ${
                categorySlug === c.slug ? "bg-pine text-paper" : "border border-mist text-ink/70 hover:border-brass"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <form method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search articles…"
            className="border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass"
          />
          <button type="submit" className="border border-mist px-4 py-2 text-sm text-ink hover:border-brass">
            Search
          </button>
        </form>
      </div>

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="mt-10 flex flex-col gap-4 border-t-2 border-brass pt-6 md:flex-row"
        >
          <div className="md:w-1/2">
            <p className="text-xs uppercase tracking-wide text-brass">Featured</p>
            <h2 className="mt-2 font-display text-2xl text-ink">{featured.title}</h2>
            <p className="mt-2 text-ink/70">{featured.excerpt}</p>
            <p className="mt-3 text-sm text-ink/50">{formatDate(featured.publishedAt)}</p>
          </div>
        </Link>
      )}

      {listedPosts.length === 0 ? (
        <div className="mt-10 border border-dashed border-mist p-12 text-center text-ink/50">
          {q ? `No articles match "${q}".` : "No articles here yet — check back soon."}
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {listedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="border-t-2 border-mist pt-4 hover:border-brass">
              {post.category && <p className="text-xs uppercase tracking-wide text-brass">{post.category.name}</p>}
              <h3 className="mt-2 font-display text-lg text-ink">{post.title}</h3>
              <p className="mt-2 text-sm text-ink/60 line-clamp-3">{post.excerpt}</p>
              <p className="mt-3 text-xs text-ink/40">{formatDate(post.publishedAt)}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
