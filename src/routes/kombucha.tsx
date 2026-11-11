import { createFileRoute, Link } from "@tanstack/react-router";
import { getArticle } from "@/data/articles";
import { ArticleBody } from "@/components/ArticleBody";
import { SiteHeader, SiteFooter } from "@/components/HubUI";

export const Route = createFileRoute("/kombucha")({
  head: () => ({ meta: [
    { title: "Wellnous Kombucha — Small-batch fermented tea" },
    { name: "description", content: "Wellnous Kombucha: naturally fermented, small-batch tea with live cultures." },
    { property: "og:title", content: "Wellnous Kombucha" },
    { property: "og:description", content: "Naturally fermented, small-batch tea with live cultures." },
  ]}),
  component: Kombucha,
});

function Kombucha() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-5 pt-16">
        <h1 className="font-display text-5xl font-semibold tracking-tight">Wellnous Kombucha</h1>
        <p className="mt-4 text-lg text-muted-foreground">Our small-batch kombucha puts the fermented-foods lessons from the hub into a bottle: real tea, live cultures and a gentle fizz.</p>
        <ArticleBody article={getArticle("wellnous-kombucha")!} />
        <Link to="/articles/$slug" params={{ slug: "cultured-foods" }} className="mt-10 inline-block text-sm font-medium text-primary hover:underline">← Read about gut health & fermented foods</Link>
      </section>
      <SiteFooter />
    </div>
  );
}
