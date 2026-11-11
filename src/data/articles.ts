import raw from "@/content/wellnous_articles.md?raw";

export type Block =
  | { type: "h"; level: 2 | 3 | 4; text: string }
  | { type: "p"; text: string }
  | { type: "li"; text: string }
  | { type: "step"; text: string }
  | { type: "quote"; text: string };

export type Article = {
  slug: string;
  title: string;
  blocks: Block[];
  refs: string[];
  standfirst: string;
  excerpt: string;
  minutes: number;
  chips: string[];
  refCount: number;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/%26/g, "and")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const cleanTitle = (s: string) =>
  s
    .replace(/%26/g, "&")
    .replace(/^Nac$/, "NAC")
    .replace(/^Omega 3$/, "Omega-3")
    .replace(/^Fermented Vegetables$/, "Fermented Vegetables")
    .replace(/^Probiotic Yogurts$/, "Probiotic Yogurts")
    .replace(/^Milk Kefir$/, "Milk Kefir")
    .replace(/^Water Kefir$/, "Water Kefir")
    .replace(/^Kombucha$/, "Kombucha");

const BULLET = /^[-*•]\s+(.*)$/;
const HEADING = /^(#{2,4})\s+(.*)$/;
const isRef = (l: string) => /et al|\[[a-z0-9.-]+\.[a-z]{2,}\]/i.test(l);

function parseSection(title: string, lines: string[]): Article {
  const blocks: Block[] = [];
  const refs: string[] = [];
  let inRefs = false;

  for (const l of lines) {
    const line = l.trim();
    if (!line || line === "---") continue;
    const h = HEADING.exec(line);
    if (h) {
      const raw2 = (h[2] ?? "").trim().replace(/[:：]\s*$/, "");
      const text = raw2.charAt(0).toUpperCase() + raw2.slice(1);
      if (/^references$/i.test(text)) {
        inRefs = true;
        continue;
      }
      inRefs = false;
      blocks.push({ type: "h", level: (h[1] ?? "").length as 2 | 3 | 4, text });
      continue;
    }
    if (inRefs) {
      const b = BULLET.exec(line);
      refs.push((b ? b[1] ?? "" : line).trim());
      continue;
    }
    if (line.startsWith(">")) {
      blocks.push({ type: "quote", text: line.replace(/^>\s*/, "").trim() });
      continue;
    }
    const b = BULLET.exec(line);
    if (b) {
      blocks.push({ type: "li", text: (b[1] ?? "").trim() });
      continue;
    }
    const step = /^\d+(?:\\)?[.)]\s+(.*)$/.exec(line);
    if (step) {
      blocks.push({ type: "step", text: step[1] ?? "" });
      continue;
    }
    blocks.push({ type: "p", text: line });
  }

  const words = blocks.reduce((a, b) => a + b.text.split(/\s+/).length, 0);
  const firstP = blocks.find((b) => b.type === "p")?.text ?? "";
  const firstH4 = blocks.find((b) => b.type === "h" && b.level === 4)?.text ?? "";
  const firstHeadingIndex = blocks.findIndex((b) => b.type === "h" && b.level === 4);
  const excerpt = firstP.length > 170 ? firstP.slice(0, 167).replace(/\s+\S*$/, "") + "…" : firstP;
  const chips = blocks
    .filter((b) => b.type === "h" && b.text.length < 48 && !b.text.endsWith("?"))
    .slice(0, 3)
    .map((b) => b.text);

  return {
    slug: slugify(title),
    title: cleanTitle(title),
    blocks,
    refs,
    standfirst: firstH4 && firstHeadingIndex < 3 ? firstH4 : "",
    excerpt,
    minutes: Math.max(1, Math.round(words / 220)),
    chips,
    refCount: refs.length || blocks.filter((b) => b.type === "li" && isRef(b.text)).length,
  };
}

export function parseArchive(md: string): Article[] {
  return md
    .split(/^# /m)
    .slice(1)
    .map((sec) => {
      const lines = sec.split("\n");
      return parseSection((lines[0] ?? "").trim(), lines.slice(1));
    })
    .filter((a) => a.title && a.blocks.length > 0);
}

export const articles = parseArchive(raw);
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
