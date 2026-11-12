import type { Article } from "@/data/articles";
import { pillars } from "@/data/hub";

export const physicalArticleSlugs = [...new Set(
  pillars.filter((pillar) => pillar.slug === "physical").flatMap((pillar) => pillar.trays.flatMap((tray) => tray.slugs)),
)];

export function needsPhysicalDisclaimer(slug: string): boolean {
  return physicalArticleSlugs.includes(slug);
}

// Replace a source disclaimer only in presentation; keep the archive intact.
export function withoutSourceDisclaimer(article: Article): Article {
  let skipping = false;
  return { ...article, blocks: article.blocks.filter((block) => {
    if (block.type === "h") {
      skipping = /health\s*(?:&|and)\s*safety disclaimer/i.test(block.text);
      return !skipping;
    }
    return !skipping;
  }) };
}