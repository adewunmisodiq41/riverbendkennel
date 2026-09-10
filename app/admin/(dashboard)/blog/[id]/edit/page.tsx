import { notFound } from "next/navigation";
import BlogPostForm from "@/components/BlogPostForm";
import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "@/lib/actions/blog";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  const boundUpdate = updateBlogPost.bind(null, post.id);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Edit post</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <BlogPostForm action={boundUpdate} post={post} />
      </div>
    </div>
  );
}
