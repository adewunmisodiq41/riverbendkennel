import BlogPostForm from "@/components/BlogPostForm";
import { createBlogPost } from "@/lib/actions/blog";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">New post</h1>
      <div className="mt-8 max-w-2xl bg-paper p-8">
        <BlogPostForm action={createBlogPost} />
      </div>
    </div>
  );
}
