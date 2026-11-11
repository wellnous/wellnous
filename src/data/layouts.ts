// Presentation-only structure: groups the author's verbatim paragraphs into titled cards.
// Each marker opens a card when a paragraph (or list) starts with `start`; `end` closes the current card group.
export type Marker = { start: string; title?: string; end?: boolean };

export const layouts: Record<string, Marker[]> = {
  "cultured-foods": [
    { start: "Kefir is arguably", title: "Milk Kefir" },
    { start: "Kombucha is a lightly", title: "Kombucha" },
    { start: "Water kefir is", title: "Water Kefir" },
    { start: "Traditional yogurt is", title: "Traditional Yogurt" },
    { start: "Inspired by Dr.", title: "Pro-biotic Yogurts" },
    { start: "Traditional fermentation have", title: "Cultured Vegetables" },
    { start: "Kimchi is well known", title: "Kimchi" },
    { start: "It basically means", title: "What is a SCOBY?" },
  ],
  adaptogens: [
    { start: "Ashwagandha exerts", title: "Hormones & nervous system" },
    { start: "Athletes and physically", title: "Physical performance" },
    { start: "Ashwagandha also enhances", title: "Mind & mood" },
    { start: "Often called", title: "Reishi" },
    { start: "Celebrated for", title: "Lion’s Mane" },
    { start: "Known for its ability", title: "Cordyceps" },
    { start: "Rich in antioxidants", title: "Chaga" },
    { start: "Known for its vibrant", title: "Turkey Tail" },
    { start: "Each of these mushrooms", end: true },
  ],
};
