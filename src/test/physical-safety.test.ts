import { describe, expect, it } from "vitest";
import { getArticle } from "@/data/articles";
import { needsPhysicalDisclaimer, physicalArticleSlugs, withoutSourceDisclaimer } from "@/data/physical-safety";

describe("Physical article safety coverage", () => {
  it.each([
    "physical-wellbeing", "the-power-of-compound-movement", "flow-rope",
    "sitting-on-the-floor", "deliberate-cold-exposure", "infra-red-exposure",
    "barefoot-walking", "breathwork", "mitochondrial-health", "ayurveda",
    "sleep-strategies", "reducing-our-toxic-burden", "food-additives-and-gut-health",
    "the-air-we-breathe", "skincare-cosmetics-and-sunscreen",
  ])("includes %s in the physical safety policy", (slug) => {
    expect(getArticle(slug)).toBeDefined();
    expect(needsPhysicalDisclaimer(slug)).toBe(true);
  });

  it("covers all 15 distinct physical articles without duplicates", () => {
    expect(physicalArticleSlugs).toHaveLength(15);
    expect(new Set(physicalArticleSlugs).size).toBe(15);
    expect(needsPhysicalDisclaimer("milk-kefir")).toBe(false);
  });

  it("removes only the source disclaimer from presentation without mutating source content", () => {
    const article = getArticle("the-power-of-compound-movement");
    if (!article) throw new Error("Compound movement is missing");
    const disclaimerIndex = article.blocks.findIndex((block) => block.type === "h" && /disclaimer/i.test(block.text));
    expect(disclaimerIndex).toBeGreaterThan(0);
    const original = [...article.blocks];
    const result = withoutSourceDisclaimer(article);
    expect(result.blocks).toEqual(original.slice(0, disclaimerIndex));
    expect(article.blocks).toEqual(original);
    expect(result.refs).toEqual(article.refs);
  });

  it("retains the existing physical foundation URL and Movement placement", () => {
    expect(getArticle("physical-wellbeing")).toBeDefined();
    expect(needsPhysicalDisclaimer("physical-wellbeing")).toBe(true);
  });
});