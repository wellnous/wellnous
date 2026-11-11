import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/HubUI";
import { blogPosts } from "@/data/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [
    { title: "Wellnous Blog — Reflections, Food and Health Science" },
    { name: "description", content: "Kristina Crimp's original Wellnous blog: food ideas, gut health and thoughtful reflections on everyday wellbeing." },
    { property: "og:title", content: "Wellnous Blog — Reflections, Food and Health Science" },
    { property: "og:description", content: "Read Kristina Crimp's original posts on food, gut health and everyday wellbeing." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BlogPage,
});

function BlogPage() {
  return <div className="min-h-screen bg-background"><SiteHeader />
    <main className="mx-auto max-w-6xl px-5 pt-14">
      <div className="border-b pb-8"><p className="text-xs font-semibold uppercase tracking-widest text-amber-deep">Bridging health science and everyday life</p><h1 className="mt-3 font-display text-5xl font-semibold">Wellnous Blog</h1></div>
      <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2">
        {blogPosts.map((post) => <article key={post.slug} className="border-b pb-8">
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
            {"image" in post && typeof post.image === "string" && <img src={post.image} alt={post.title} className="mb-5 aspect-[16/9] w-full rounded-lg object-cover" loading="lazy" />}
            <p className="text-xs text-amber-deep">{post.date}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold leading-snug group-hover:text-primary">{post.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.article.excerpt}</p>
            <p className="mt-4 text-sm font-semibold text-primary">Read post <span aria-hidden="true">→</span></p>
          </Link>
        </article>)}
      </div>
    </main><SiteFooter /></div>;
}