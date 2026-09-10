import { prisma } from "@/lib/prisma";
import type { BlogPost } from "@prisma/client";

export default async function BlogPostForm({
  action,
  post
}: {
  action: (formData: FormData) => void;
  post?: BlogPost;
}) {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <form action={action} className="space-y-6">
      <Field label="Title">
        <input name="title" required defaultValue={post?.title} className={inputClass} />
      </Field>

      <Field label="Excerpt (short summary shown in listings)">
        <textarea name="excerpt" rows={2} required defaultValue={post?.excerpt ?? ""} className={inputClass} />
      </Field>

      <Field label="Body">
        <textarea name="body" rows={10} required defaultValue={post?.body ?? ""} className={inputClass} />
      </Field>

      <Field label="Cover image URL (optional)">
        <input name="coverImage" defaultValue={post?.coverImage ?? ""} className={inputClass} />
      </Field>

      <Field label="Category">
        <select name="categoryId" defaultValue={post?.categoryId ?? ""} className={inputClass}>
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" name="isFeatured" defaultChecked={post?.isFeatured ?? false} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" name="publish" defaultChecked={post?.isPublished ?? false} />
          Published
        </label>
      </div>

      <button type="submit" className="bg-pine px-6 py-3 text-sm font-medium text-paper hover:bg-ink">
        Save
      </button>
    </form>
  );
}

const inputClass = "w-full border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-ink/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
