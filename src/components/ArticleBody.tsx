import type { Article, Block } from "@/data/articles";

type Node =
  | { kind: "h"; level: number; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "cards"; stacked?: boolean; cards: { title: string; body: Node[] }[] };

const anchor = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const isRef = (s: string) => /et al|\[[a-z0-9.-]+\.[a-z]{2,}\]/i.test(s);

const PERSONAL = /^(my |i |if you|if it|perhaps most|here'?s how|we |our )/i;

/* ---------- inline text: **bold** and [links](url) ---------- */

function Rich({ text }: { text: string }) {
  const bits = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <>
      {bits.map((b, i) => {
        const bold = /^\*\*([^*]+)\*\*$/.exec(b);
        if (bold) return <strong key={i} className="font-semibold text-foreground">{bold[1] ?? ""}</strong>;
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(b);
        if (link) return <a key={i} href={link[2] ?? ""} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">{link[1] ?? ""}</a>;
        return <span key={i}>{b}</span>;
      })}
    </>
  );
}

/* ---------- structure ---------- */

function toNodes(blocks: Block[], stackedSections = false): Node[] {
  const flat: Node[] = [];
  for (const b of blocks) {
    if (b.type === "li") {
      const last = flat[flat.length - 1];
      if (last && last.kind === "list") last.items.push(b.text);
      else flat.push({ kind: "list", items: [b.text] });
      continue;
    }
    if (b.type === "h") { flat.push({ kind: "h", level: b.level, text: b.text }); continue; }
    if (b.type === "quote") { flat.push({ kind: "quote", text: b.text }); continue; }
    const boldOnly = /^\*\*(.+)\*\*$/.exec(b.text.trim());
    const inner = boldOnly?.[1] ?? "";
    if (inner && inner.length <= 70 && !/[.!?;:]$/.test(inner)) {
      flat.push({ kind: "h", level: 4, text: inner });
      continue;
    }
    flat.push({ kind: "p", text: b.text });
  }

  // group "###/#### sub-heading + its content" runs into cards
  const out: Node[] = [];
  let cards: { title: string; body: Node[] }[] = [];
  const flush = () => {
    if (cards.length >= 2 || (stackedSections && cards.length > 0)) out.push({ kind: "cards", cards, stacked: stackedSections });
    else if (cards.length === 1) {
      const only = cards[0];
      if (only) out.push({ kind: "h", level: 3, text: only.title }, ...only.body);
    }
    cards = [];
  };

  for (let i = 0; i < flat.length; i++) {
    const n = flat[i];
    if (!n) continue;
    if (n.kind === "h" && n.level >= 3) {
      const body: Node[] = [];
      let j = i + 1;
      for (; j < flat.length; j++) {
        const m = flat[j];
        if (!m) continue;
        if (m.kind === "h" && m.level <= n.level) break;
        body.push(m);
      }
      const words = body.reduce((a, x) => a + (x.kind === "list" ? x.items.join(" ") : x.kind === "p" ? x.text : "").split(/\s+/).length, 0);
      if (words > 0 && (stackedSections || words < 130)) {
        cards.push({ title: n.text, body });
        i = j - 1;
        continue;
      }
      flush();
      out.push(n);
      continue;
    }
    if (n.kind === "h" && n.level === 2) { flush(); out.push(n); continue; }
    const lastCard = cards[cards.length - 1];
    if (lastCard && n.kind !== "h") { lastCard.body.push(n); continue; }
    flush();
    out.push(n);
  }
  flush();
  return out;
}

/* ---------- pieces ---------- */

const splitLabel = (s: string) => {
  const m = /^([A-Z][\w’' -/]{1,30}):\s+(.+)$/.exec(s);
  return m ? { label: m[1] ?? "", text: m[2] ?? "" } : null;
};

function List({ items, compact }: { items: string[]; compact?: boolean }) {
  const labelled = items.map(splitLabel);
  const avg = items.join(" ").length / items.length;

  if (labelled.every(Boolean)) {
    return (
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
        {labelled.map((l, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="font-display text-[17px] font-semibold text-primary">{l!.label}</div>
            <p className="mt-1 text-[15px] leading-relaxed text-foreground/85"><Rich text={l!.text} /></p>
          </div>
        ))}
      </div>
    );
  }

  if (items.length >= 3 && avg < 70) {
    return (
      <div className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {items.map((t, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-xl bg-secondary/70 px-3.5 py-2.5 text-[15px] text-secondary-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
            <span><Rich text={t} /></span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-2.5 rounded-2xl border-l-4 border-accent bg-accent/10 p-5 text-[16px]">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 leading-relaxed">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span><Rich text={t} /></span>
        </li>
      ))}
    </ul>
  );
}

function Note({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border-l-4 border-amber bg-amber/10 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-deep">In practice</p>
      <p className="mt-1.5 text-[16px] leading-relaxed text-foreground/90"><Rich text={text} /></p>
    </div>
  );
}

function Card({ title, body, index, roomy = false }: { title: string; body: Node[]; index: number; roomy?: boolean }) {
  return (
    <article id={anchor(title)} className={`flex scroll-mt-24 flex-col border bg-card shadow-soft ${roomy ? "rounded-lg p-5 sm:p-8" : "rounded-2xl p-6"}`}>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/12 font-display text-sm font-semibold text-primary">{index + 1}</span>
        <h3 className="font-display text-xl font-semibold leading-snug text-foreground">{title}</h3>
      </div>
      <div className={`leading-relaxed text-foreground/85 ${roomy ? "space-y-4 text-base" : "space-y-3 text-[15px]"}`}>
        {body.map((b, j) => <Render key={j} n={b} compact />)}
      </div>
    </article>
  );
}

function Render({ n, compact }: { n: Node; compact?: boolean }) {
  if (n.kind === "h") {
    const size = "text-xl";
    return (
      <h3 className={`${size} pt-4 font-display font-semibold text-foreground`}>
        <span className="mr-2 inline-block h-[1.05em] w-1 translate-y-[3px] rounded-full bg-amber align-baseline" />
        {n.text}
      </h3>
    );
  }
  if (n.kind === "p") {
    if (!compact && PERSONAL.test(n.text)) return <Note text={n.text} />;
    return <p className={compact ? "" : "leading-relaxed"}><Rich text={n.text} /></p>;
  }
  if (n.kind === "list") return <List items={n.items} compact={Boolean(compact)} />;
  if (n.kind === "quote") {
    return (
      <blockquote className="rounded-2xl border-l-4 border-primary bg-secondary/50 p-5 font-display text-lg italic text-foreground/90">
        <Rich text={n.text} />
      </blockquote>
    );
  }
  return (
    <div className={`grid items-start py-1 ${n.stacked ? "gap-6" : "gap-4 md:grid-cols-2"}`}>
      {n.cards.map((c, i) => <Card key={i} title={c.title} body={c.body} index={i} roomy={Boolean(n.stacked)} />)}
    </div>
  );
}

/* ---------- article ---------- */

export function ArticleBody({ article }: { article: Article }) {
  const blocks = article.blocks.filter((b) => !(b.type === "li" && isRef(b.text)));
  const hasLead = Boolean(article.standfirst) && blocks[0]?.type === "h" && blocks[0]?.text === article.standfirst;
  const nodes = toNodes(hasLead ? blocks.slice(1) : blocks, article.slug === "feeding-your-body");
  const sections = nodes.filter((n): n is Extract<Node, { kind: "h" }> => n.kind === "h" && n.level === 2);
  const cardTitles = nodes.flatMap((n) => (n.kind === "cards" ? n.cards.map((c) => c.title) : []));
  const navItems = sections.length > 2 ? sections.map((s) => s.text) : cardTitles.length > 2 ? cardTitles : [];

  return (
    <>
      {hasLead && (
        <p className="mt-6 border-l-4 border-amber pl-5 font-display text-xl leading-relaxed text-foreground/80">
          <Rich text={article.standfirst} />
        </p>
      )}

      {navItems.length > 2 && (
        <nav className="mt-8 rounded-2xl border bg-secondary/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-deep">In this article</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {navItems.map((t, i) => (
              <a key={`${t}-${i}`} href={`#${anchor(t)}`} className="rounded-full bg-card px-3 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-primary hover:text-primary-foreground">
                {t}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="mt-8 space-y-6">
        {nodes.map((n, i) => {
          if (n.kind === "h" && n.level === 2) {
            return (
              <section key={i} id={anchor(n.text)} className="scroll-mt-24 pt-6">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                  <span className="mb-1 block h-1 w-12 rounded-full bg-amber" />
                  {n.text}
                </h2>
              </section>
            );
          }
          return <Render key={i} n={n} />;
        })}
      </div>

      {article.refs.length > 0 && (
        <section className="mt-14 rounded-2xl border bg-muted p-6">
          <h2 className="font-display text-xl font-semibold">Scientific references</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
            {article.refs.map((r, i) => <li key={i}><Rich text={r} /></li>)}
          </ol>
        </section>
      )}
    </>
  );
}
