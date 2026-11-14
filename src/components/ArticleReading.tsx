import { Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, ListChecks } from "lucide-react";
import type { ReactElement } from "react";
import type { Article, Block } from "@/data/articles";
import { readingSections, recipeSlugs } from "@/data/article-presentation";
import { Rich } from "@/components/RichText";

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const foodLinks: Record<string, string> = { "Probiotics": "probiotics", "Milk Kefir": "milk-kefir", "Kombucha": "kombucha", "Water Kefir": "water-kefir", "Pro-biotic Yogurts": "probiotic-yogurts", "Cultured Vegetables": "fermented-vegetables", "Kimchi": "kimchi" };

// Presentation patterns used by the "fancier" editorial articles (currently the
// infrared deep dive). Each one is opt-in per article so nothing else re-styles.
const LABELLED = /^\*\*(.+?):\*\*\s*(.+)$/;
const PANEL = /^\*\*(.+):\*\*$/;
const SAFETY = /^\*\*(A note on [a-z ]*safety):\*\*\s*(.+)$/i;
const BOLD_ONLY = /^\*\*([^*]+?)\*\*$/;
const FANCY = ["mental-wellbeing", "food-additives-and-gut-health", "omega-3", "creatine", "infra-red-exposure", "sleep-strategies", "ayurveda", "flow-rope", "barefoot-walking", "cultured-foods"];
const BOXED_H3 = ["mental-wellbeing", "creatine", "ayurveda", "sleep-strategies", "barefoot-walking", "flow-rope"];
// Articles whose level-3 sections are self-contained methods: each one, plus the
// sub-headings under it, reads as a single recipe box rather than separate strips.
const METHOD_H3 = ["fermented-vegetables"];
const BARE_URL = /(https?:\/\/\S+)$/;

type Group = { type: "p" | "quote" | "list" | "steps"; items: string[] };

function Paragraphs({ blocks, fancy = false, habits = false }: { blocks: Block[]; fancy?: boolean; habits?: boolean }) {
  const groups: Group[] = [];
  for (const block of blocks) {
    const type = block.type === "li" ? "list" : block.type === "step" ? "steps" : block.type === "quote" ? "quote" : "p";
    const last = groups.at(-1);
    if ((type === "list" || type === "steps") && last?.type === type) last.items.push(block.text);
    else groups.push({ type, items: [block.text] });
  }

  const out: ReactElement[] = [];
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i]!;
    const text = g.items[0] ?? "";

    // "**The science deep dive**" and the paragraphs after it sit in a skippable box.
    if (g.type === "p" && /^\*\*The science deep dive\*\*$/i.test(text)) {
      const body: string[] = [];
      let k = i + 1;
      while (groups[k]?.type === "p" && !BOLD_ONLY.test(groups[k]!.items[0] ?? "")) { body.push(groups[k]!.items[0] ?? ""); k++; }
      out.push(<aside key={i} aria-label="The science deep dive" className="rounded-2xl border border-primary/25 bg-secondary/40 p-5 sm:p-6">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary"><BookOpen aria-hidden="true" className="h-4 w-4" />The science deep dive <span className="font-normal normal-case tracking-normal text-muted-foreground">· optional reading</span></p>
        <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed">{body.map((t, m) => <p key={m}><Rich text={t} /></p>)}</div>
      </aside>);
      i = k - 1;
      continue;
    }

    // "**Label:**" paragraph followed by a list becomes a side-by-side panel.
    if (fancy && g.type === "p") {
      const panel = PANEL.exec(text);
      const next = groups[i + 1];
      if (panel && next && next.type === "list") {
        const panels = [{ label: panel[1] ?? "", items: next.items }];
        let k = i + 2;
        for (;;) {
          const p = groups[k];
          const q = groups[k + 1];
          const m = p && p.type === "p" ? PANEL.exec(p.items[0] ?? "") : null;
          if (!m || !q || q.type !== "list") break;
          panels.push({ label: m[1] ?? "", items: q.items });
          k += 2;
        }
        out.push(<div key={i} className={`grid gap-4 ${panels.length > 1 ? "md:grid-cols-2" : ""}`}>{panels.map((p, j) => (
          <div key={j} className={`rounded-2xl border p-5 ${j === 0 ? "border-primary/25 bg-primary/5" : "border-amber/45 bg-amber/10"}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-widest ${j === 0 ? "text-primary" : "text-amber-deep"}`}>{p.label}</p>
            <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed">
              {p.items.map((t, m) => <li key={m} className="flex gap-2.5"><span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${j === 0 ? "bg-primary" : "bg-amber"}`} /><span><Rich text={t} /></span></li>)}
            </ul>
          </div>
        ))}</div>);
        i = k - 1;
        continue;
      }
    }

    // Runs of "**Title**" followed by paragraphs become a grid of topic cards.
    if (fancy && g.type === "p" && BOLD_ONLY.test(text) && !PANEL.test(text)) {
      const cards: { title: string; body: string[] }[] = [];
      let k = i;
      while (groups[k]?.type === "p" && BOLD_ONLY.test(groups[k]!.items[0] ?? "") && !PANEL.test(groups[k]!.items[0] ?? "")) {
        const card = { title: BOLD_ONLY.exec(groups[k]!.items[0] ?? "")?.[1] ?? "", body: [] as string[] };
        k++;
        while (groups[k]?.type === "p" && !BOLD_ONLY.test(groups[k]!.items[0] ?? "") && !LABELLED.test(groups[k]!.items[0] ?? "")) { card.body.push(groups[k]!.items[0] ?? ""); k++; }
        if (!card.body.length) break;
        cards.push(card);
      }
      if (cards.length >= 2) {
        out.push(<div key={i} className="grid gap-4 sm:grid-cols-2">{cards.map((c, j) => (
          <div key={j} id={anchor(c.title)} className={`scroll-mt-24 rounded-2xl border border-primary/20 bg-secondary/40 p-5 ${cards.length % 2 === 1 && j === cards.length - 1 ? "sm:col-span-2" : ""}`}>
            <p className="font-display text-lg font-semibold text-primary">{c.title}</p>
            <div className="mt-2 space-y-3 text-[0.95rem] leading-relaxed">{c.body.map((t, m) => <p key={m}><Rich text={t} /></p>)}</div>
          </div>
        ))}</div>);
        i = k - 1;
        continue;
      }
    }

    // "**Why it matters:** …" style lead-ins read as labelled strips.
    if (fancy && g.type === "p" && LABELLED.test(text) && !SAFETY.test(text) && !/^\*\*Try it/.test(text)) {
      const m = LABELLED.exec(text);
      out.push(<div key={i} className="rounded-xl border-l-4 border-primary bg-background/70 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{m?.[1]}</p>
        <p className="mt-1 text-[0.95rem] leading-relaxed"><Rich text={m?.[2] ?? ""} /></p>
      </div>);
      continue;
    }

    // A list of "**Label:** detail" items becomes a grid of small cards.
    if (fancy && g.type === "list" && g.items.length >= 3 && g.items.every((t) => LABELLED.test(t))) {
      out.push(<div key={i} className="grid gap-3 sm:grid-cols-2">{g.items.map((t, j) => {
        const m = LABELLED.exec(t);
        return <div key={j} className="rounded-xl border bg-card p-4 shadow-soft">
          <div className="font-display text-[15px] font-semibold text-primary">{m?.[1] ?? ""}</div>
          <p className="mt-1 text-[0.92rem] leading-relaxed text-foreground/85"><Rich text={m?.[2] ?? ""} /></p>
        </div>;
      })}</div>);
      continue;
    }

    // A list of bare citation links becomes a stack of readable reference rows.
    if (fancy && g.type === "list" && g.items.every((t) => BARE_URL.test(t))) {
      out.push(<ul key={i} className="space-y-3">{g.items.map((t, j) => {
        const m = BARE_URL.exec(t);
        const url = m?.[1] ?? "";
        const label = t.slice(0, m?.index ?? t.length).replace(/[:\s]+$/, "") || url;
        return <li key={j} className="rounded-xl border bg-background px-4 py-3 text-[0.92rem] leading-relaxed">
          <span className="block"><Rich text={label} /></span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-block text-sm font-semibold text-primary">Read the paper <span aria-hidden="true">→</span></a>
        </li>;
      })}</ul>);
      continue;
    }

    // Any other list in a fancy article reads as ticked key points.
    if (fancy && g.type === "list") {
      out.push(<ul key={i} className="grid gap-2.5 sm:grid-cols-2">{g.items.map((t, j) => <li key={j} className="flex gap-2.5 text-[0.95rem] leading-relaxed"><CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" /><span><Rich text={t} /></span></li>)}</ul>);
      continue;
    }

    if (habits && g.type === "list") { out.push(<ul key={i} className="grid gap-3 sm:grid-cols-2">{g.items.map((t, j) => <li key={j} className="flex items-start gap-3 rounded-xl border border-primary/20 bg-secondary/40 p-4 text-[0.95rem] leading-relaxed shadow-soft"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber/20 font-display text-sm font-semibold text-amber-deep">{j + 1}</span><span><Rich text={t} /></span></li>)}</ul>); continue; }
    if (g.type === "list") { out.push(<ul key={i} className="list-disc space-y-2 pl-5 marker:text-primary">{g.items.map((t, j) => <li key={j}><Rich text={t} /></li>)}</ul>); continue; }
    if (g.type === "steps") { out.push(<ol key={i} className="recipe-steps">{g.items.map((t, j) => <li key={j}><Rich text={t} /></li>)}</ol>); continue; }
    if (g.type === "quote" && /^Evidence note:/i.test(text)) { out.push(<aside key={i} className="rounded-xl border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">Evidence note: </span><Rich text={text.replace(/^Evidence note:\s*/i, "")} /></aside>); continue; }
    if (g.type === "quote") { out.push(<blockquote key={i} className="border-l-4 border-amber py-2 pl-5 font-display text-2xl font-semibold text-primary"><Rich text={g.items[0] ?? ""} /></blockquote>); continue; }

    const safety = SAFETY.exec(text);
    if (safety) {
      out.push(<div key={i} className="rounded-xl border-l-4 border-amber bg-amber/10 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-deep">{safety[1]}</p>
        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-foreground/90"><Rich text={safety[2] ?? ""} /></p>
      </div>);
      continue;
    }

    if (/^\*\*Try it/.test(text)) { out.push(<p key={i} className="rounded-md border-l-4 border-amber bg-background/80 px-4 py-3 text-sm"><Rich text={text} /></p>); continue; }
    out.push(<p key={i}><Rich text={text} /></p>);
  }
  return <>{out}</>;
}

export function ArticleReading({ article }: { article: Article }) {
  const hasLead = article.blocks[0]?.type === "h" && article.blocks[0]?.text === article.standfirst;
  const sections = readingSections(hasLead ? article.blocks.slice(1) : article.blocks);
  const recipe = recipeSlugs.includes(article.slug);
  const fancy = FANCY.includes(article.slug);
  const method = METHOD_H3.includes(article.slug);
  const isBox = (s?: { title: string; level: number }) => !!s && (/^\d\.\s/.test(s.title) || (BOXED_H3.includes(article.slug) && s.level === 3));
  const headings = method ? sections.filter((s) => s.level === 3) : sections.filter((s) => s.title && (!fancy || s.level === 2));
  return <>
    {hasLead && <p className="mt-6 border-l-4 border-amber pl-5 font-display text-xl leading-relaxed text-foreground/80"><Rich text={article.standfirst} /></p>}
    {headings.length > 2 && <nav aria-label="In this article" className="mt-8 border-y py-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-deep">In this article</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{headings.map((s, i) => <a key={i} href={`#${anchor(s.title)}`} className="text-sm text-primary underline decoration-primary/25 underline-offset-4 hover:decoration-primary">{s.title}</a>)}</div>
    </nav>}
    <div className={`mt-8 space-y-8 text-base leading-relaxed text-foreground/85 ${article.slug.startsWith("blog-") ? "blog-reading" : ""}`}>
      {sections.map((section, i) => {
        // Each level-3 method becomes one self-contained box: its own title, its
        // own "what you'll need" / "what to do" blocks, and nothing leaking out.
        if (method && section.level === 3) {
          const prev = sections[i - 1];
          if (prev && prev.level >= 3) return null;
          const group: typeof sections = [];
          for (let k = i; k < sections.length && (sections[k]?.level ?? 0) >= 3; k++) group.push(sections[k]!);
          const ordinal = sections.slice(0, i).filter((s) => s.level === 3).length + 1;
          return <section key={i} id={anchor(section.title)} className="scroll-mt-28 rounded-2xl border border-primary/25 bg-secondary/30 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base font-semibold text-primary-foreground">{ordinal}</span>
              <h2 className="font-display text-2xl font-semibold leading-snug text-primary">{section.title}</h2>
            </div>
            <div className="mt-4 space-y-5">
              <div className="space-y-3 text-[0.95rem] leading-relaxed"><Paragraphs blocks={section.blocks} /></div>
              {group.slice(1).map((s, j) => <div key={j} className="space-y-2">
                {s.title && <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-deep">{s.title}</p>}
                {s.mode === "ingredients"
                  ? <ul className="grid list-disc gap-x-8 gap-y-2 pl-5 marker:text-primary sm:grid-cols-2">{s.blocks.map((b, m) => <li key={m}><Rich text={b.text} /></li>)}</ul>
                  : <div className="space-y-3 text-[0.95rem] leading-relaxed"><Paragraphs blocks={s.blocks} /></div>}
              </div>)}
            </div>
          </section>;
        }
        const boxed = (article.slug === "breathwork" || fancy) && isBox(section);
        if (boxed) {
          if (i > 0 && isBox(sections[i - 1])) return null;
          const group: typeof sections = [];
          for (let k = i; k < sections.length && isBox(sections[k]); k++) group.push(sections[k]!);
          return <div key={i} className="grid gap-5 md:grid-cols-2">{group.map((b, j) => {
            const [, num, name] = /^(\d)\.\s+(.*)$/.exec(b.title) ?? [, "", b.title];
            const intense = article.slug === "breathwork" && j === 3;
            return <section key={j} id={anchor(b.title)} className={`scroll-mt-28 flex flex-col rounded-2xl border p-6 shadow-sm ${intense ? "border-amber/60 bg-amber/10" : "border-primary/20 bg-secondary/40"}`}>
              <div className="mb-4 flex items-center gap-3">
                {num && <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold ${intense ? "bg-amber text-amber-foreground" : "bg-primary text-primary-foreground"}`}>{num}</span>}
                <h2 className="font-display text-xl font-semibold leading-snug text-foreground">{name}</h2>
              </div>
              <div className="space-y-4 text-[0.95rem]"><Paragraphs blocks={b.blocks} fancy={fancy} /></div>
            </section>;
          })}</div>;
        }
        const scoby = article.slug === "cultured-foods" && /what is a scoby/i.test(section.title);
        const takeaway = /takeaway|bringing it all together/i.test(section.title);
        const sources = article.slug === "polyphenols" && /richest sources|how to eat more/i.test(section.title);
        const practical = /a note on safety/i.test(section.title);
        const link = article.slug === "cultured-foods" ? foodLinks[section.title] : undefined;
        const ingredients = recipe && section.mode === "ingredients";
        const deepDive = article.slug === "physical-wellbeing" && /deep dive/i.test(section.title);
        const keyPoints = fancy && /^key points$/i.test(section.title);
        const emerging = fancy && /what is established/i.test(section.title);
        const closing = fancy && /^the bigger picture$/i.test(section.title);
        const reading = fancy && /^further reading$/i.test(section.title);
        const deepDive2 = fancy && /^deep dive/i.test(section.title);
        const safetyBox = fancy && /^a note on safety$/i.test(section.title);
        return <section key={i} id={anchor(section.title)} className={`scroll-mt-28 ${deepDive || deepDive2 ? "border-y-2 border-primary bg-secondary/30 py-7 px-5 sm:px-7" : safetyBox ? "rounded-2xl border-l-4 border-amber bg-amber/10 p-6 sm:p-8" : deepDive ? "border-y-2 border-primary bg-secondary/30 py-7 px-5 sm:px-7" : scoby ? "rounded-lg border bg-secondary/35 p-5 sm:p-8" : takeaway ? "border-y-2 border-primary bg-secondary/30 py-8" : sources ? "border-l-4 border-amber pl-5 sm:pl-7" : keyPoints ? "rounded-2xl border border-primary/25 bg-secondary/40 p-6 sm:p-8" : emerging ? "rounded-2xl border bg-card p-6 sm:p-8" : closing ? "rounded-2xl border-l-4 border-primary bg-secondary/35 p-6 sm:p-8" : reading ? "rounded-2xl border bg-muted p-6 sm:p-8" : practical ? "rounded-lg border bg-secondary/40 p-6" : ingredients ? "border-y border-primary/30 bg-secondary/25 py-6" : section.title ? "border-t pt-7" : ""}`}>
          {section.title && <h2 className={`mb-4 font-display font-semibold leading-snug text-foreground ${section.title === "It's Muscle Loss." ? "text-3xl" : takeaway ? "text-3xl text-primary" : keyPoints || reading ? "flex items-center gap-2 text-xl text-primary" : "text-xl"}`}>
            {keyPoints && <ListChecks aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />}
            {reading && <BookOpen aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />}
            {section.title}
          </h2>}
          <div className="space-y-4">
            {ingredients ? <ul className="grid list-disc gap-x-8 gap-y-2 pl-5 marker:text-primary sm:grid-cols-2">{section.blocks.map((b, j) => <li key={j}><Rich text={b.text} /></li>)}</ul>
              : <Paragraphs blocks={section.blocks} fancy={fancy} habits={article.slug === "polyphenols" && /how to eat more/i.test(section.title)} />}
          </div>
          {link && <Link to="/articles/$slug" params={{ slug: link }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Keep reading: {section.title} <span aria-hidden="true">→</span></Link>}
        </section>;
      })}
    </div>
    {article.refs.length > 0 && <section className="mt-14 border-t pt-8"><h2 className="font-display text-xl font-semibold">Scientific references</h2><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">{article.refs.map((r, i) => <li key={i}><Rich text={r} /></li>)}</ol></section>}
  </>;
}
