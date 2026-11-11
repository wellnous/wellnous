import { createFileRoute } from "@tanstack/react-router";
import { getArticle } from "@/data/articles";
import { SiteHeader, SiteFooter } from "@/components/HubUI";
import { ArticleBody } from "@/components/ArticleBody";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "Who We Are — Wellnous" },
    { name: "description", content: "The story and people behind the Wellnous health and wellness knowledge hub." },
    { property: "og:title", content: "Who We Are — Wellnous" },
    { property: "og:description", content: "The story and people behind the Wellnous knowledge hub." },
  ]}),
  component: () => {
    const a = getArticle("who-we-are")!;
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <article className="mx-auto max-w-3xl px-5 pt-14">
          <h1 className="font-display text-5xl font-semibold tracking-tight">Who We Are</h1>
          <ArticleBody article={a} />
        </article>
        <SiteFooter />
      </div>
    );
  },
});
