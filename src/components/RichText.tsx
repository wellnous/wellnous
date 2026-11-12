import { Link } from "@tanstack/react-router";
import { articles } from "@/data/articles";

function internalSlug(url: string) {
  if (!url.startsWith("https://wellnous.godaddysites.com/")) return undefined;
  const path = decodeURIComponent(url.split("/").at(-1) ?? "").toLowerCase();
  const aliases: Record<string, string> = { "what-is-a-scoby": "cultured-foods", "feeding-your-body": "feeding-your-body", "supplements-&-adaptogens": "supplements-and-adaptogens" };
  return articles.find((a) => a.slug === (aliases[path] ?? path))?.slug;
}

// Emphasis-wrapped links have to be matched before plain emphasis, otherwise
// `**[label](url)**` splits into a bold token plus a bare link token.
const TOKEN = /(\*\*\[[^\]]+\]\([^)]+\)\*\*|\*\[[^\]]+\]\([^)]+\)\*|_\[[^\]]+\]\([^)]+\)_|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|_[^_]+_)/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

function unwrap(bit: string): { wrap: "bold" | "italic" | null; inner: string } {
  if (/^\*\*[\s\S]+\*\*$/.test(bit)) return { wrap: "bold", inner: bit.slice(2, -2) };
  if (/^\*[\s\S]+\*$/.test(bit)) return { wrap: "italic", inner: bit.slice(1, -1) };
  if (/^_[\s\S]+_$/.test(bit)) return { wrap: "italic", inner: bit.slice(1, -1) };
  return { wrap: null, inner: bit };
}

function Anchor({ label, url }: { label: string; url: string }) {
  const slug = internalSlug(url);
  if (slug) return <Link to="/articles/$slug" params={{ slug }} hash={url.endsWith("what-is-a-scoby") ? "what-is-a-scoby" : ""} className="text-primary underline underline-offset-4">{label}</Link>;
  return <a href={url} target="_blank" rel="noopener noreferrer" className="break-words text-primary underline underline-offset-4">{label}</a>;
}

export function Rich({ text }: { text: string }) {
  const normalized = text.replace(/\\([*_])/g, "$1").replace(/\\\|/g, "|");
  const bits = normalized.split(TOKEN).filter(Boolean);
  return <>{bits.map((bit, i) => {
    const { wrap, inner } = unwrap(bit);
    const link = LINK.exec(inner);
    if (link) {
      const node = <Anchor label={link[1] ?? ""} url={link[2] ?? ""} />;
      if (wrap === "bold") return <strong key={i} className="font-semibold text-foreground">{node}</strong>;
      if (wrap === "italic") return <em key={i}>{node}</em>;
      return <span key={i}>{node}</span>;
    }
    if (wrap === "bold") return <strong key={i} className="font-semibold text-foreground">{inner}</strong>;
    if (wrap === "italic") return <em key={i}>{inner}</em>;
    return <span key={i}>{bit}</span>;
  })}</>;
}
