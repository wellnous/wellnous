import raw from "@/content/wellnous_articles.md?raw";

export type Block = { type: "h" | "p" | "ref"; text: string };
export type Article = { slug: string; title: string; blocks: Block[]; excerpt: string; minutes: number; chips: string[]; refCount: number };

const slugify = (s: string) => s.toLowerCase().replace(/%26/g, "and").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const cleanTitle = (s: string) => s.replace(/%26/g, "&").replace(/^Nac$/, "NAC").replace(/^Omega 3$/, "Omega-3");

const isRef = (l: string) => /et al|\[[a-z0-9.-]+\.[a-z]{2,}\]/i.test(l);
const isHeading = (l: string) => l.length < 90 && !/[.,;]$/.test(l) && !l.includes("[") && !/^https?:/.test(l);

export function parseArchive(md: string): Article[] {
  const sections = md.split(/^## /m).slice(1);
  return sections.map((sec) => {
    const lines = sec.split("\n");
    const title = cleanTitle((lines[0] ?? "").trim());
    const blocks: Block[] = lines.slice(1).map((l) => l.trim()).filter((l) => l && l !== "---")
      .map((l) => (isRef(l) ? { type: "ref", text: l } : isHeading(l) ? { type: "h", text: l } : { type: "p", text: l }) as Block);
    const words = blocks.reduce((a, b) => a + b.text.split(/\s+/).length, 0);
    const first = blocks.find((b) => b.type === "p")?.text ?? "";
    return {
      slug: slugify(title), title, blocks,
      excerpt: first.length > 170 ? first.slice(0, 167).replace(/\s+\S*$/, "") + "…" : first,
      minutes: Math.max(1, Math.round(words / 220)),
      chips: blocks.filter((b) => b.type === "h" && b.text.length < 48 && !b.text.endsWith("?")).slice(0, 3).map((b) => b.text),
      refCount: blocks.filter((b) => b.type === "ref").length,
    };
  });
}

export const articles = parseArchive(raw);
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
