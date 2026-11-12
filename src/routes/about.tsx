import { createFileRoute } from "@tanstack/react-router";
import { getArticle } from "@/data/articles";
import { SiteHeader, SiteFooter } from "@/components/HubUI";
import { ArticleBody } from "@/components/ArticleBody";
import founderPhoto from "@/assets/kristina-crimp-portrait.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "Who We Are — Wellnous" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
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
          <div className="mt-8 flex items-center gap-5">
            <img
              src={founderPhoto.url}
              alt="Kristina Crimp, founder of Wellnous"
              className="h-24 w-24 shrink-0 rounded-full border-2 border-primary/30 object-cover object-top shadow-md sm:h-32 sm:w-32"
            />
            <div>
              <p className="font-display text-2xl font-semibold">Kristina Crimp</p>
              <p className="mt-1 text-muted-foreground">Founder of Wellnous — Scientist and Cambridge Natural Sciences graduate.</p>
            </div>
          </div>
          <ArticleBody article={a} />
        </article>
        <SiteFooter />
      </div>
    );
  },
});
