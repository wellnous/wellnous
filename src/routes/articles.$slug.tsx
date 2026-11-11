import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArticle } from "@/data/articles";
import { pillars } from "@/data/hub";
import { SiteHeader, SiteFooter, Chip } from "@/components/HubUI";
import { ArticleBody } from "@/components/ArticleBody";
import { Clock, BookOpen } from "lucide-react";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { slug: article.slug, title: article.title, excerpt: article.excerpt };
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.title} — Wellnous` },
    { name: "description", content: loaderData.excerpt },
    { property: "og:title", content: `${loaderData.title} — Wellnous` },
    { property: "og:description", content: loaderData.excerpt },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary" },
  ] : [{ title: "Article not found — Wellnous" }, { name: "robots", content: "noindex" }] }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useLoaderData();
  const a = getArticle(slug)!;
  const pillar = pillars.find((p) => p.trays.some((t) => t.slugs.includes(slug)));
  const tray = pillar?.trays.find((t) => t.slugs.includes(slug));
  const related = pillar?.trays.flatMap((t) => t.slugs).filter((s) => s !== slug).map(getArticle).filter(Boolean).slice(0, 4) ?? [];
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-5 pt-14">
        {pillar && <Link to={`/${pillar.slug}`} className="text-sm font-medium text-primary hover:underline">← {pillar.title}</Link>}
        {tray && <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-amber-deep">{tray.name}</p>}
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{a.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{a.minutes} min read</span>
          {a.refCount > 0 && <span className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4" />{a.refCount} references</span>}
        </div>
        {a.chips.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{a.chips.map((c) => <Chip key={c}>{c}</Chip>)}</div>}
        <ArticleBody article={a} />
      </article>
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-3xl px-5">
          <h2 className="font-display text-2xl font-semibold">Keep reading</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((r) => r && (
              <Link key={r.slug} to="/articles/$slug" params={{ slug: r.slug }} className="rounded-2xl border bg-card p-4 hover:bg-secondary">
                <p className="font-display text-lg font-semibold">{r.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.minutes} min read</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <SiteFooter />
    </div>
  );
}
