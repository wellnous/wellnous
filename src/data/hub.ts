export type Tray = { name: string; slugs: string[] };
export type Pillar = { slug: "nutrition" | "physical" | "mind"; title: string; tagline: string; intro: string; trays: Tray[] };

export const pillars: Pillar[] = [
  { slug: "nutrition", title: "Everyday Nutrition", tagline: "Feed your body, simply.",
    intro: "Explore the science on sugar, fibre, protein, the gut and everyday chemical exposures.",
    trays: [
      { name: "Foundations", slugs: ["feeding-your-body", "added-sugar", "protein", "intermittent-fasting", "childrens-nutrition", "eating-for-a-healthy-mind"] },
      { name: "Fibre & Plant Power", slugs: ["fibre", "resistant-starch", "polyphenols"] },
      { name: "Cultured Foods", slugs: ["probiotics", "cultured-foods", "milk-kefir", "kombucha", "kimchi", "fermented-vegetables", "water-kefir", "probiotic-yogurts", "l-reuteri", "gut-brain-connection"] },
      { name: "Supplements", slugs: ["creatine", "omega-3"] },
    ] },
  { slug: "physical", title: "Physical Protocols", tagline: "Move, recover, recharge.",
    intro: "Movement, light, temperature and sleep — the protocols behind energy, resilience and a calm mind.",
    trays: [
      { name: "Movement", slugs: ["physical-wellbeing", "the-power-of-compound-movement", "flow-rope", "sitting-on-the-floor"] },
      { name: "Energy & Recovery", slugs: ["mitochondrial-health", "deliberate-cold-exposure", "infra-red-exposure"] },
      { name: "Grounding", slugs: ["barefoot-walking", "ayurveda", "breathwork", "sleep-strategies"] },
      { name: "Environment & Toxins", slugs: ["reducing-our-toxic-burden", "food-additives-and-gut-health", "the-air-we-breathe", "skincare-cosmetics-and-sunscreen"] },
    ] },
  { slug: "mind", title: "Mental Health", tagline: "Calm, clarity, resilience.",
    intro: "Practices for a steadier mind — mental wellbeing, attention, breathwork, restorative sleep and grounding practices such as Ayurveda, barefoot walking and morning light.",
    trays: [
      { name: "Mind & Attention", slugs: ["mental-wellbeing", "gut-brain-connection", "eating-for-a-healthy-mind", "the-art-of-doing-nothing", "breathwork"] },
      { name: "Rest & Resilience", slugs: ["sleep-strategies", "deliberate-cold-exposure"] },
      { name: "Grounding", slugs: ["breathwork", "ayurveda", "barefoot-walking", "flow-rope", "sleep-strategies"] },
    ] },
];

export type QuickWin = { label: string; slug: string; hash?: string };

export const quickWins: QuickWin[] = [
  { label: "Morning sun exposure", slug: "sleep-strategies", hash: "morning-light-setting-the-body-clock" },
  { label: "Eat real foods", slug: "feeding-your-body", hash: "whole-foods-first" },
  { label: "Move more", slug: "physical-wellbeing", hash: "healthspan-over-lifespan" },
  { label: "Walk after meals", slug: "physical-wellbeing", hash: "deep-dive-muscle-as-a-glucose-sink" },
  { label: "Protein at breakfast to stay fuller for longer", slug: "protein", hash: "what-s-proven-protein-and-muscle-health" },
  { label: "Finish eating 2–3 hours before bed to aid sleep", slug: "intermittent-fasting", hash: "3-your-body-clock-why-eating-earlier-may-matter" },
  { label: "Consume a fermented food", slug: "cultured-foods", hash: "milk-kefir" },
  { label: "Breathe deeply for 2 min", slug: "breathwork", hash: "1-the-physiological-sigh" },
  { label: "Don't heat food in plastic containers", slug: "reducing-our-toxic-burden", hash: "4-how-i-reduce-everyday-exposure" },
];
