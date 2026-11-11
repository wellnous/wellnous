import type { Article } from "@/data/articles";

export function ArticleBody({ article }: { article: Article }) {
  const body = article.blocks.filter((b) => b.type !== "ref");
  const refs = article.blocks.filter((b) => b.type === "ref");
  return (
    <>
      <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-foreground/90">
        {body.map((b, i) => b.type === "h"
          ? <h2 key={i} className="pt-6 font-display text-2xl font-semibold text-foreground">{b.text}</h2>
          : <p key={i}>{b.text}</p>)}
      </div>
      {refs.length > 0 && (
        <section className="mt-14 rounded-2xl border bg-muted p-6">
          <h2 className="font-display text-xl font-semibold">Scientific references</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
            {refs.map((r, i) => <li key={i}>{r.text}</li>)}
          </ol>
        </section>
      )}
    </>
  );
}
