import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "@/lib/actions/blog";

export default async function AdminBlogCategoriesPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } }
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Blog categories</h1>

      <form action={createCategory} className="mt-8 flex max-w-md gap-3">
        <input
          name="name"
          required
          placeholder="Category name"
          className="flex-1 border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass"
        />
        <button type="submit" className="bg-pine px-5 py-2 text-sm font-medium text-paper hover:bg-ink">
          Add
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="mt-8 text-sm text-ink/50">No categories yet.</p>
      ) : (
        <ul className="mt-8 max-w-md divide-y divide-mist bg-paper">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between px-6 py-3 text-sm">
              <span className="text-ink">
                {c.name} <span className="text-ink/40">({c._count.posts})</span>
              </span>
              <form action={deleteCategory.bind(null, c.id)}>
                <button type="submit" className="text-ink/40 hover:text-red-600">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
