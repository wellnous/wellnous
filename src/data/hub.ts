export type Tray = { name: string; slugs: string[] };
export type Pillar = { slug: "nutrition" | "physical" | "mind"; title: string; tagline: string; intro: string; trays: Tray[] };

export const pillars: Pillar[] = [
  { slug: "nutrition", title: "Everyday Nutrition", tagline: "Feed your body, simply.",
    intro: "Explore the science on sugar, fibre, protein, the gut and everyday chemical exposures.",
    trays: [
      { name: "Foundations", slugs: ["feeding-your-body", "added-sugar", "protein", "intermittent-fasting"] },
      { name: "Supplements", slugs: ["creatine", "omega-3"] },
      { name: "Fibre & Plant Power", slugs: ["fibre", "resistant-starch", "polyphenols"] },
      { name: "Gut & Cultured Foods", slugs: ["probiotics", "cultured-foods", "milk-kefir", "kombucha", "kimchi", "fermented-vegetables", "water-kefir", "probiotic-yogurts"] },
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
      { name: "Mind & Attention", slugs: ["mental-wellbeing", "the-art-of-doing-nothing", "breathwork"] },
      { name: "Rest & Resilience", slugs: ["sleep-strategies", "deliberate-cold-exposure"] },
      { name: "Grounding", slugs: ["breathwork", "ayurveda", "barefoot-walking", "flow-rope", "sleep-strategies"] },
    ] },
];

export type QuickWin = { label: string; slug: string };

export const quickWins: QuickWin[] = [
  { label: "Morning sun exposure", slug: "sleep-strategies" },
  { label: "Eat real foods", slug: "feeding-your-body" },
  { label: "Move more", slug: "physical-wellbeing" },
  { label: "Walk after meals", slug: "added-sugar" },
  { label: "Protein at breakfast to stay fuller for longer", slug: "protein" },
  { label: "Finish eating 2–3 hours before bed to aid sleep", slug: "intermittent-fasting" },
  { label: "Consume a fermented food", slug: "cultured-foods" },
  { label: "Breathe deeply for 2 min", slug: "breathwork" },
  { label: "Don't heat food in plastic containers", slug: "reducing-our-toxic-burden" },
];
