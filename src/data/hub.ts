export type Tray = { name: string; slugs: string[] };
export type Pillar = { slug: "nutrition" | "physical" | "supplements"; title: string; tagline: string; intro: string; trays: Tray[] };

export const pillars: Pillar[] = [
  { slug: "nutrition", title: "Everyday Nutrition", tagline: "Feed your body, simply.",
    intro: "Explore the science on sugar, fibre, protein, the gut and the hidden toxins in everyday life.",
    trays: [
      { name: "Foundations", slugs: ["feeding-your-body", "reconsider-sugar", "protein", "intermittent-fasting"] },
      { name: "Fibre & Plant Power", slugs: ["fibre", "resistant-starch", "polyphenols"] },
      { name: "Gut & Cultured Foods", slugs: ["cultured-foods", "milk-kefir", "water-kefir", "fermented-vegetables", "probiotic-yogurts", "kimchi", "kombucha", "probiotics"] },
      { name: "Traditions", slugs: ["ayurveda"] },
      { name: "Toxins", slugs: ["hidden-toxins"] },
    ] },
  { slug: "physical", title: "Physical Protocols", tagline: "Move, recover, recharge.",
    intro: "Movement, light, temperature and sleep — the protocols behind energy, resilience and a calm mind.",
    trays: [
      { name: "Movement", slugs: ["physical-wellbeing", "kettlebells", "barefoot-walking"] },
      { name: "Energy & Recovery", slugs: ["mitochondrial-health", "deliberate-cold-exposure", "infra-red-exposure"] },
      { name: "Sleep & Mind", slugs: ["sleep-strategies", "mental-wellbeing"] },
    ] },
  { slug: "supplements", title: "Supplements", tagline: "Fill gaps, not cabinets.",
    intro: "Deep dive into the supplements and adaptogens worth knowing about.",
    trays: [
      { name: "Start Here", slugs: ["supplements-and-adaptogens", "adaptogens"] },
      { name: "Deep Dives", slugs: ["creatine", "omega-3", "nac"] },
    ] },
];

export const quickWins = ["Morning sun exposure", "Eat real foods", "Move more", "Walk after meals", "Protein at breakfast", "Stop eating well before bedtime", "Consume a fermented food", "Breathe deeply for 2 min"];
