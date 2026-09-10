import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  return { title: post ? post.title : "Blog post" };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { category: true }
  });

  if (!post || !post.isPublished) notFound();

  const related = post.categoryId
    ? await prisma.blogPost.findMany({
        where: { categoryId: post.categoryId, isPublished: true, NOT: { id: post.id } },
        orderBy: { publishedAt: "desc" },
        take: 3
      })
    : [];

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/blog" className="text-sm text-brass hover:text-brasslight">
        ← All articles
      </Link>

      {post.category && (
        <p className="mt-4 text-xs uppercase tracking-wide text-brass">{post.category.name}</p>
      )}
      <h1 className="mt-2 font-display text-4xl text-ink">{post.title}</h1>
      <p className="mt-2 text-sm text-ink/50">{formatDate(post.publishedAt)}</p>

      {post.coverImage && (
        <div className="mt-6 aspect-[16/9] overflow-hidden bg-paperdim">
          <Image src={post.coverImage} alt={post.title} width={800} height={450} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-8 whitespace-pre-line leading-relaxed text-ink/80">{post.body}</div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-mist pt-8">
          <h2 className="font-display text-xl text-ink">Related articles</h2>
          <ul className="mt-4 space-y-3">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/blog/${r.slug}`} className="text-brass hover:text-brasslight">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
