import rawPosts from "@/content/wellnous_blog.json";
import { parseArchive } from "@/data/articles";

export const blogPosts = rawPosts.map((post) => {
  const article = parseArchive(`# ${post.title}\n\n${post.body}`)[0];
  if (!article) throw new Error(`Empty blog post: ${post.title}`);
  return { ...post, article: { ...article, slug: `blog-${post.slug}` } };
});
export const getBlogPost = (slug: string) => blogPosts.find((post) => post.slug === slug);