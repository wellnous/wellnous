import { Link } from "@tanstack/react-router";
import { articles } from "@/data/articles";

function internalSlug(url: string) {
  if (!url.startsWith("https://wellnous.godaddysites.com/")) return undefined;
  const path = decodeURIComponent(url.split("/").at(-1) ?? "").toLowerCase();
  const aliases: Record<string, string> = { "what-is-a-scoby": "cultured-foods", "feeding-your-body": "feeding-your-body", "supplements-&-adaptogens": "supplements-and-adaptogens" };
  return articles.find((a) => a.slug === (aliases[path] ?? path))?.slug;
}

export function Rich({ text }: { text: string }) {
  const normalized = text.replace(/\\([*_])/g, "$1").replace(/\\\|/g, "|");
  const bits = normalized.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|_[^_]+_)/g).filter(Boolean);
  return <>{bits.map((bit, i) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(bit);
    if (bold) return <strong key={i} className="font-semibold text-foreground">{bold[1]}</strong>;
    const italic = /^_([^_]+)_$/.exec(bit);
    if (italic) return <em key={i}>{italic[1]}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(bit);
    if (link) {
      const url = link[2] ?? "";
      const slug = internalSlug(url);
      if (slug) return <Link key={i} to="/articles/$slug" params={{ slug }} hash={url.endsWith("what-is-a-scoby") ? "what-is-a-scoby" : ""} className="text-primary underline underline-offset-4">{link[1]}</Link>;
      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="break-words text-primary underline underline-offset-4">{link[1]}</a>;
    }
    return <span key={i}>{bit}</span>;
  })}</>;
}