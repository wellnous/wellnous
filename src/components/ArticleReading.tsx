import { Link } from "@tanstack/react-router";
import type { Article, Block } from "@/data/articles";
import { readingSections, recipeSlugs } from "@/data/article-presentation";
import { Rich } from "@/components/RichText";

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const foodLinks: Record<string, string> = { "Probiotics": "probiotics", "Milk Kefir": "milk-kefir", "Kombucha": "kombucha", "Water Kefir": "water-kefir", "Pro-biotic Yogurts": "probiotic-yogurts", "Cultured Vegetables": "fermented-vegetables", "Kimchi": "kimchi" };

function Paragraphs({ blocks }: { blocks: Block[] }) {
  const groups: { type: "p" | "quote" | "list" | "steps"; items: string[] }[] = [];
  for (const block of blocks) {
    const type = block.type === "li" ? "list" : block.type === "step" ? "steps" : block.type === "quote" ? "quote" : "p";
    const last = groups.at(-1);
    if ((type === "list" || type === "steps") && last?.type === type) last.items.push(block.text);
    else groups.push({ type, items: [block.text] });
  }
  return <>{groups.map((g, i) => {
    if (g.type === "list") return <ul key={i} className="list-disc space-y-2 pl-5 marker:text-primary">{g.items.map((text, j) => <li key={j}><Rich text={text} /></li>)}</ul>;
    if (g.type === "steps") return <ol key={i} className="recipe-steps">{g.items.map((text, j) => <li key={j}><Rich text={text} /></li>)}</ol>;
    if (g.type === "quote") return <blockquote key={i} className="border-l-4 border-amber py-2 pl-5 font-display text-2xl font-semibold text-primary"><Rich text={g.items[0] ?? ""} /></blockquote>;
    return <p key={i}><Rich text={g.items[0] ?? ""} /></p>;
  })}</>;
}

export function ArticleReading({ article }: { article: Article }) {
  const hasLead = article.blocks[0]?.type === "h" && article.blocks[0]?.text === article.standfirst;
  const sections = readingSections(hasLead ? article.blocks.slice(1) : article.blocks);
  const recipe = recipeSlugs.includes(article.slug);
  const headings = sections.filter((s) => s.title);
  return <>
    {hasLead && <p className="mt-6 border-l-4 border-amber pl-5 font-display text-xl leading-relaxed text-foreground/80"><Rich text={article.standfirst} /></p>}
    {headings.length > 2 && <nav aria-label="In this article" className="mt-8 border-y py-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-deep">In this article</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{headings.map((s, i) => <a key={i} href={`#${anchor(s.title)}`} className="text-sm text-primary underline decoration-primary/25 underline-offset-4 hover:decoration-primary">{s.title}</a>)}</div>
    </nav>}
    <div className="mt-8 space-y-8 text-base leading-relaxed text-foreground/85">
      {sections.map((section, i) => {
        const scoby = article.slug === "cultured-foods" && /what is a scoby/i.test(section.title);
        const takeaway = /takeaway|bringing it all together/i.test(section.title);
        const sources = article.slug === "polyphenols" && /richest sources|how to eat more/i.test(section.title);
        const practical = article.slug === "deliberate-cold-exposure" && /recommended exposure/i.test(section.title);
        const link = article.slug === "cultured-foods" ? foodLinks[section.title] : undefined;
        const ingredients = recipe && section.mode === "ingredients";
        const steps = recipe && section.mode === "steps";
        return <section key={i} id={anchor(section.title)} className={`scroll-mt-28 ${scoby ? "rounded-lg border bg-secondary/35 p-5 sm:p-8" : takeaway ? "border-y-2 border-primary bg-secondary/30 py-8" : sources ? "border-l-4 border-amber pl-5 sm:pl-7" : practical ? "rounded-lg border bg-secondary/40 p-6" : ingredients ? "border-y border-primary/30 bg-secondary/25 py-6" : section.title ? "border-t pt-7" : ""}`}>
          {section.title && <h2 className={`mb-4 font-display font-semibold leading-snug text-foreground ${section.title === "It's Muscle Loss." ? "text-3xl" : takeaway ? "text-3xl text-primary" : "text-xl"}`}>{section.title}</h2>}
          <div className="space-y-4">
            {ingredients ? <ul className="grid list-disc gap-x-8 gap-y-2 pl-5 marker:text-primary sm:grid-cols-2">{section.blocks.map((b, j) => <li key={j}><Rich text={b.text} /></li>)}</ul>
              : steps ? <ol className="recipe-steps">{section.blocks.map((b, j) => <li key={j}><Rich text={b.text} /></li>)}</ol>
                : <Paragraphs blocks={section.blocks} />}
          </div>
          {link && <Link to="/articles/$slug" params={{ slug: link }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Keep reading: {section.title} <span aria-hidden="true">→</span></Link>}
        </section>;
      })}
    </div>
    {article.refs.length > 0 && <section className="mt-14 border-t pt-8"><h2 className="font-display text-xl font-semibold">Scientific references</h2><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">{article.refs.map((r, i) => <li key={i}><Rich text={r} /></li>)}</ol></section>}
  </>;
}