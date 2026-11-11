import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articles, type Article } from "@/data/articles";
import { pillars } from "@/data/hub";
import { SiteHeader, SiteFooter, Chip } from "@/components/HubUI";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Wellnous Topic Library — Explore Health Science" },
      {
        name: "description",
        content:
          "Browse all Wellnous articles: science-informed reads on nutrition, movement, sleep, supplements and the gut — each with its references.",
      },
      { property: "og:title", content: "Wellnous Topic Library — Explore Health Science" },
      {
        property: "og:description",
        content:
          "Browse all Wellnous articles: science-informed reads on nutrition, movement, sleep, supplements and the gut — each with its references.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BlogPage,
});

const pillarOf = (slug: string) =>
  pillars.find((p) => p.trays.some((t) => t.slugs.includes(slug)));

function BlogCard({ article }: { article: Article }) {
  const pillar = pillarOf(article.slug);
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="group flex flex-col rounded-2xl border bg-card p-5 shadow-soft transition-transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {pillar && (
          <span className="font-semibold uppercase tracking-wider text-amber-deep">{pillar.title}</span>
        )}
        <span className="ml-auto flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.minutes} min
          </span>
          {article.refCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {article.refCount} refs
            </span>
          )}
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-card-foreground">
        {article.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      <p className="mt-auto pt-4 text-sm font-medium text-primary">
        Read article <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </p>
    </Link>
  );
}

function BlogPage() {
  const [query, setQuery] = useState("");
  const [pillar, setPillar] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (pillar && pillarOf(a.slug)?.slug !== pillar) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.chips.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [query, pillar]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-deep">
          Bridging health science and everyday life
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Topic Library</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every Wellnous article in one place — {articles.length} science-informed reads, each with its
          references, ready to skim or study.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-full border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setPillar(null)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                pillar === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              All
            </Button>
            {pillars.map((p) => (
              <Button
                key={p.slug}
                onClick={() => setPillar(pillar === p.slug ? null : p.slug)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  pillar === p.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                {p.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-muted p-10 text-center">
            <p className="font-display text-xl font-semibold">Nothing matches that search</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different word, or clear the search to browse everything.
            </p>
            <Button
              onClick={() => {
                setQuery("");
                setPillar(null);
              }}
              className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {filtered.length} article{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <BlogCard key={a.slug} article={a} />
              ))}
            </div>
          </>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
