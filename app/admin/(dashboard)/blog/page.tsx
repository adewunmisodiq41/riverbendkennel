import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost } from "@/lib/actions/blog";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Blog</h1>
        <div className="flex gap-3">
          <Link href="/admin/blog/categories" className="border border-mist px-5 py-2.5 text-sm text-ink hover:border-brass">
            Categories
          </Link>
          <Link href="/admin/blog/new" className="bg-pine px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink">
            New post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-center text-sm text-ink/60">
          No posts yet.{" "}
          <Link href="/admin/blog/new" className="text-brass hover:text-brasslight">
            Write your first one
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-mist bg-paper">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-ink">
                  {p.title} {p.isFeatured && <span className="ml-2 text-xs text-brass">Featured</span>}
                </p>
                <p className="text-sm text-ink/50">
                  {p.category?.name ?? "Uncategorized"} · {p.isPublished ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href={`/admin/blog/${p.id}/edit`} className="text-brass hover:text-brasslight">
                  Edit
                </Link>
                <form action={deleteBlogPost.bind(null, p.id)}>
                  <button type="submit" className="text-ink/40 hover:text-red-600">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
