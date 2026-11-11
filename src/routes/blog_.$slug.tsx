import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBlogPost, blogPosts } from "@/data/blog";
import { SiteHeader, SiteFooter } from "@/components/HubUI";
import { ArticleBody } from "@/components/ArticleBody";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData: post }) => ({ meta: post ? [
    { title: `${post.title} — Wellnous Blog` },
    { name: "description", content: post.article.excerpt },
    { property: "og:title", content: `${post.title} — Wellnous Blog` },
    { property: "og:description", content: post.article.excerpt },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    ...("image" in post && typeof post.image === "string" ? [{ property: "og:image", content: post.image }, { name: "twitter:image", content: post.image }] : []),
  ] : [{ title: "Post not found — Wellnous Blog" }] }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-3xl px-5 pt-12">
    <Link to="/blog" className="text-sm font-medium text-primary">← Wellnous Blog</Link>
    <p className="mt-6 text-xs text-amber-deep">{post.date}</p>
    <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
    {"image" in post && typeof post.image === "string" && <img src={post.image} alt={post.title} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />}
    {post.slug === "reclaiming-recovery-my-post-surgical-protocol" && <aside className="mt-6 border-l-4 border-amber bg-secondary/30 p-5 text-sm leading-relaxed">This post describes Kristina’s personal experience, not a recommended recovery plan. Follow your surgical team’s advice; do not stop prescribed medicines or replace pain relief with supplements without medical guidance.</aside>}
    <ArticleBody article={post.article} />
    <section className="mt-14 border-t pt-8"><h2 className="font-display text-xl font-semibold">Keep reading</h2><div className="mt-4 space-y-4">{blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3).map((p) => <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="block text-primary">{p.title} →</Link>)}</div></section>
  </main><SiteFooter /></div>;
}