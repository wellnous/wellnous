import type { Article, Block } from "@/data/articles";

export const recipeSlugs = ["milk-kefir", "water-kefir", "fermented-vegetables", "kimchi", "kombucha"];
export const editorialSlugs = ["ayurveda", "reducing-our-toxic-burden", "food-additives-and-gut-health", "the-air-we-breathe", "skincare-cosmetics-and-sunscreen", "mental-wellbeing", "sleep-strategies", "physical-wellbeing", "deliberate-cold-exposure", "intermittent-fasting", "polyphenols", "protein", "cultured-foods", "the-art-of-doing-nothing", "breathwork", "flow-rope", "sitting-on-the-floor", "infra-red-exposure", "omega-3", "creatine", "probiotic-yogurts", "childrens-nutrition", "l-reuteri", "gut-brain-connection", "eating-for-a-healthy-mind", "what-your-great-grandma-knew", "a-taste-of-a-british-winter"];

const recommendations: Record<string, string[]> = {
  "cultured-foods": ["probiotics", "milk-kefir", "water-kefir", "fermented-vegetables"],
  "probiotics": ["cultured-foods", "fibre", "probiotic-yogurts", "milk-kefir"],
  "milk-kefir": ["water-kefir", "probiotic-yogurts", "fermented-vegetables", "cultured-foods"],
  "water-kefir": ["milk-kefir", "kombucha", "probiotics", "cultured-foods"],
  "fermented-vegetables": ["kimchi", "milk-kefir", "probiotics", "cultured-foods"],
  "probiotic-yogurts": ["l-reuteri", "milk-kefir", "childrens-nutrition", "cultured-foods"],
  "l-reuteri": ["probiotic-yogurts", "gut-brain-connection", "cultured-foods", "milk-kefir"],
  "childrens-nutrition": ["food-additives-and-gut-health", "added-sugar", "probiotic-yogurts", "feeding-your-body"],
  "gut-brain-connection": ["eating-for-a-healthy-mind", "cultured-foods", "fibre", "mental-wellbeing"],
  "eating-for-a-healthy-mind": ["gut-brain-connection", "omega-3", "polyphenols", "mental-wellbeing"],
  "kimchi": ["fermented-vegetables", "probiotic-yogurts", "probiotics", "cultured-foods"],
  "kombucha": ["water-kefir", "polyphenols", "probiotics", "cultured-foods"],
  "protein": ["creatine", "feeding-your-body", "intermittent-fasting"],
  "polyphenols": ["fibre", "resistant-starch", "probiotics", "feeding-your-body"],
  "intermittent-fasting": ["protein", "sleep-strategies", "feeding-your-body", "mitochondrial-health"],
  "mental-wellbeing": ["sleep-strategies", "omega-3", "barefoot-walking", "deliberate-cold-exposure"],
  "sleep-strategies": ["mental-wellbeing", "infra-red-exposure", "mitochondrial-health", "physical-wellbeing"],
  "the-art-of-doing-nothing": ["mental-wellbeing", "breathwork", "sleep-strategies", "barefoot-walking"],
  "breathwork": ["mental-wellbeing", "the-art-of-doing-nothing", "deliberate-cold-exposure", "sleep-strategies"],
  "sitting-on-the-floor": ["physical-wellbeing", "barefoot-walking", "flow-rope"],
  "the-power-of-compound-movement": ["physical-wellbeing", "sitting-on-the-floor", "flow-rope"],
};

export function relatedSlugs(article: Article, fallback: string[]): string[] {
  return (recommendations[article.slug] ?? fallback).filter((slug) => slug !== article.slug).slice(0, 4);
}

export type ReadingSection = { title: string; level: number; blocks: Block[]; mode: "prose" | "ingredients" | "steps" };

export function readingSections(blocks: Block[]): ReadingSection[] {
  const sections: ReadingSection[] = [];
  let current: ReadingSection = { title: "", level: 2, blocks: [], mode: "prose" };
  for (const block of blocks) {
    if (block.type === "h") {
      if (current.title || current.blocks.length) sections.push(current);
      current = {
        title: block.text, level: block.level, blocks: [],
        mode: /what you[’']ll need/i.test(block.text) ? "ingredients" : /what to do|how to make kefir|^stage \d|lets make kombucha|first or second brew/i.test(block.text) ? "steps" : "prose",
      };
    } else current.blocks.push(block);
  }
  if (current.title || current.blocks.length) sections.push(current);
  return sections;
}