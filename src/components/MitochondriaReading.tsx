import type { Article, Block } from "@/data/articles";
import { Rich } from "@/components/RichText";

type Sub = { title: string; blocks: Block[] };
type Part = { title: string; heading: string; intro: Block[]; subs: Sub[] };

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function group(blocks: Block[]) {
  const intro: Block[] = [];
  const parts: Part[] = [];
  let part: Part | null = null;
  let sub: Sub | null = null;
  for (const b of blocks) {
    if (b.type === "h" && b.level === 2) { part = { title: b.text, heading: "", intro: [], subs: [] }; parts.push(part); sub = null; continue; }
    if (!part) { intro.push(b); continue; }
    if (b.type === "h" && b.level === 3 && !part.heading && !sub) { part.heading = b.text; continue; }
    if (b.type === "h") { sub = { title: b.text, blocks: [] }; part.subs.push(sub); continue; }
    (sub ? sub.blocks : part.intro).push(b);
  }
  return { intro, parts };
}

function Flow({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) out.push(<ul key={out.length} className="grid gap-2 sm:grid-cols-2">{list.map((t, i) => <li key={i} className="rounded-md bg-secondary/50 px-4 py-2.5 text-sm"><Rich text={t} /></li>)}</ul>); list = []; };
  for (const b of blocks) {
    if (b.type === "li" || b.type === "step") { list.push(b.text); continue; }
    flush();
    out.push(b.type === "quote"
      ? <blockquote key={out.length} className="border-l-4 border-amber pl-5 font-display text-xl text-primary"><Rich text={b.text} /></blockquote>
      : <p key={out.length}><Rich text={b.text} /></p>);
  }
  flush();
  return <div className="space-y-4">{out}</div>;
}

export function MitochondriaReading({ article }: { article: Article }) {
  const body = article.blocks[0]?.type === "h" && article.blocks[0].text === article.standfirst ? article.blocks.slice(1) : article.blocks;
  const { intro, parts } = group(body);
  return <div className="text-base leading-relaxed text-foreground/85">
    {article.standfirst && <p className="mt-6 border-l-4 border-amber pl-5 font-display text-2xl leading-snug text-foreground/85">{article.standfirst}</p>}
    <div className="mt-8 rounded-2xl bg-secondary/40 p-6 sm:p-8"><Flow blocks={intro} /></div>
    <nav aria-label="In this article" className="mt-10 grid gap-3 sm:grid-cols-2">
      {parts.map((p) => <a key={p.title} href={`#${anchor(p.title)}`} className="rounded-xl border bg-card p-4 transition-colors hover:bg-secondary">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-deep">{p.title.split("–")[0]}</span>
        <span className="mt-1 block font-display text-lg font-semibold text-foreground">{p.heading || p.title.split("–")[1] || p.title}</span>
      </a>)}
    </nav>
    {parts.map((p) => {
      const actions = /what can we do/i.test(p.title);
      const deep = /deep dive/i.test(p.title);
      const closing = /bigger picture/i.test(p.title);
      return <section key={p.title} id={anchor(p.title)} className={`mt-16 scroll-mt-28 ${deep ? "-mx-5 rounded-none bg-primary/5 px-5 py-10 sm:mx-0 sm:rounded-3xl sm:px-10" : ""} ${closing ? "rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10" : ""}`}>
        <p className={`text-xs font-semibold uppercase tracking-widest ${closing ? "text-primary-foreground/70" : "text-amber-deep"}`}>{p.title.split("–")[0]}</p>
        <h2 className={`mt-2 font-display text-3xl font-semibold leading-tight ${closing ? "" : "text-foreground"}`}>{p.heading || p.title}</h2>
        {p.intro.length > 0 && <div className="mt-5"><Flow blocks={p.intro} /></div>}
        {p.subs.length > 0 && <div className={`mt-8 grid gap-4 ${actions ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
          {p.subs.map((s, i) => <article key={s.title} className={actions ? "rounded-2xl border bg-card p-5 shadow-soft" : "rounded-2xl border bg-card p-6"}>
            <div className="flex items-start gap-3">
              {(actions || deep) && <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">{i + 1}</span>}
              <h3 className="font-display text-xl font-semibold leading-snug text-foreground">{s.title}</h3>
            </div>
            <div className={`mt-3 ${actions ? "text-sm" : ""}`}><Flow blocks={s.blocks} /></div>
          </article>)}
        </div>}
      </section>;
    })}
    {article.refs.length > 0 && <section className="mt-14 border-t pt-8"><h2 className="font-display text-xl font-semibold">Scientific references</h2><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-muted-foreground">{article.refs.map((r, i) => <li key={i}><Rich text={r} /></li>)}</ol></section>}
  </div>;
}
