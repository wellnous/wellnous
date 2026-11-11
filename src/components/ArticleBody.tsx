import type { Article, Block } from "@/data/articles";
import { layouts } from "@/data/layouts";

type Node =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "cards"; cards: { title: string; body: Node[] }[] };

const norm = (s: string) => s.replace(/\s+/g, "");

// A run-on paragraph followed by its own lines split apart becomes one list (keeps every word once).
function dedupe(blocks: Block[]): Node[] {
  const out: Node[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]!;
    if (b.type === "p") {
      let acc = "", j = i + 1;
      const target = norm(b.text);
      while (j < blocks.length && blocks[j]!.type !== "ref" && acc.length < target.length) {
        acc += norm(blocks[j]!.text); j++;
        if (acc === target && j - i - 1 >= 2) break;
      }
      if (acc === target && j - i - 1 >= 2) {
        const items = blocks.slice(i + 1, j).map((x) => x.text);
        // first item reads as an intro sentence when it isn't list-like
        out.push({ kind: "list", items });
        i = j - 1; continue;
      }
    }
    out.push({ kind: b.type === "h" ? "h" : "p", text: b.text });
  }
  return out;
}

const firstText = (n: Node): string => (n.kind === "list" ? (n.items[0] ?? "") : n.kind === "p" ? n.text : "");

function structure(nodes: Node[], slug: string): Node[] {
  const markers = layouts[slug] ?? [];
  const out: Node[] = [];
  let group: Extract<Node, { kind: "cards" }> | null = null;
  for (const n of nodes) {
    const m = n.kind !== "h" ? markers.find((x) => (firstText(n) ?? "").startsWith(x.start)) : undefined;
    if (n.kind === "h" || m?.end) group = null;
    if (m && !m.end) {
      if (!group) { group = { kind: "cards", cards: [] }; out.push(group); }
      group.cards.push({ title: m.title!, body: [n] });
      continue;
    }
    if (group) { group.cards[group.cards.length - 1]!.body.push(n); continue; }
    out.push(n);
  }
  return out;
}

const splitLabel = (s: string) => {
  const m = s.match(/^([A-Z][\w’' -]{1,28}):\s+(.+)$/);
  return m ? { label: m[1], text: m[2] } : null;
};

function List({ items }: { items: string[] }) {
  const labelled = items.map(splitLabel);
  if (labelled.every(Boolean)) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {labelled.map((l, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <div className="font-display font-semibold text-primary">{l!.label}</div>
            <p className="mt-1 text-[15px] text-foreground/85">{l!.text}</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <ul className="space-y-2 rounded-2xl border-l-4 border-accent bg-accent/10 p-5 text-[16px]">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t}</li>
      ))}
    </ul>
  );
}

function Render({ n, compact }: { n: Node; compact?: boolean }) {
  if (n.kind === "h") return <h2 className="pt-6 font-display text-2xl font-semibold text-foreground">{n.text}</h2>;
  if (n.kind === "p") return <p className={compact ? "text-[15px]" : ""}>{n.text}</p>;
  if (n.kind === "list") return <List items={n.items} />;
  return (
    <div className="grid gap-5 py-2 md:grid-cols-2">
      {n.cards.map((c, i) => (
        <article key={i} className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">{i + 1}</span>
            <h3 className="font-display text-xl font-semibold text-foreground">{c.title}</h3>
          </div>
          <div className="space-y-3 leading-relaxed text-foreground/85">
            {c.body.map((b, j) => <Render key={j} n={b} compact />)}
          </div>
        </article>
      ))}
    </div>
  );
}

export function ArticleBody({ article }: { article: Article }) {
  const nodes = structure(dedupe(article.blocks.filter((b) => b.type !== "ref")), article.slug);
  const refs = article.blocks.filter((b) => b.type === "ref");
  return (
    <>
      <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-foreground/90">
        {nodes.map((n, i) => <Render key={i} n={n} />)}
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
