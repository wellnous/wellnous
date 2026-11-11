export type Topic = { title: string; blurb: string; minutes: number; chips: string[] };
export type Tray = { name: string; topics: Topic[] };
export type Pillar = { slug: "nutrition" | "physical" | "supplements"; title: string; tagline: string; intro: string; trays: Tray[] };

export const pillars: Pillar[] = [
  {
    slug: "nutrition", title: "Everyday Nutrition", tagline: "Feed your body, simply.",
    intro: "Practical, food-first habits for steady energy, a happy gut and fewer hidden toxins.",
    trays: [
      { name: "Foundations", topics: [
        { title: "Build a balanced plate", blurb: "Half veg, a palm of protein, a fist of slow carbs and a thumb of healthy fat.", minutes: 3, chips: ["Protein each meal", "Fibre first", "Colour variety"] },
        { title: "Blood sugar basics", blurb: "Why spikes and crashes drive cravings, and how meal order changes them.", minutes: 4, chips: ["Veg before carbs", "Walk after meals", "Pair carbs with protein"] },
        { title: "Hydration that works", blurb: "Water plus minerals beats water alone for many people.", minutes: 2, chips: ["Pinch of salt", "Front-load mornings", "Watch urine colour"] },
        { title: "Reading labels", blurb: "Spot added sugars, seed oils and ultra-processed fillers in seconds.", minutes: 3, chips: ["Short ingredient list", "Sugar's 50+ names", "Serving size traps"] },
      ]},
      { name: "Gut & Cultured Foods", topics: [
        { title: "Your microbiome 101", blurb: "Trillions of microbes shape digestion, mood and immunity.", minutes: 4, chips: ["30 plants a week", "Feed with fibre", "Limit antibiotics overuse"] },
        { title: "Fermented foods", blurb: "Sauerkraut, kefir, kimchi, miso and kombucha bring live cultures.", minutes: 3, chips: ["Small daily servings", "Unpasteurised = live", "Start slow"] },
        { title: "Probiotics vs prebiotics", blurb: "One adds microbes, the other feeds them. You need both.", minutes: 3, chips: ["Onion & garlic", "Green bananas", "Oats & legumes"] },
      ]},
      { name: "Hidden Toxins", topics: [
        { title: "Kitchen swaps", blurb: "Cut everyday exposure from plastics and non-stick coatings.", minutes: 3, chips: ["Glass storage", "Cast iron & steel", "No heating in plastic"] },
        { title: "Produce priorities", blurb: "Where organic matters most, and where it matters less.", minutes: 2, chips: ["Wash well", "Peel when needed", "Buy seasonal"] },
        { title: "Filter your water", blurb: "What common filters remove and which suits your home.", minutes: 3, chips: ["Carbon basics", "Reverse osmosis", "Remineralise"] },
      ]},
    ],
  },
  {
    slug: "physical", title: "Physical Protocols", tagline: "Move, recover, recharge.",
    intro: "Simple routines for strength, sleep, light and cellular energy — the habits behind feeling good.",
    trays: [
      { name: "Movement", topics: [
        { title: "Strength twice a week", blurb: "Muscle is your metabolic and longevity reserve.", minutes: 4, chips: ["Push, pull, squat", "Progressive load", "30 min is enough"] },
        { title: "Zone 2 cardio", blurb: "Easy, conversational effort that builds your aerobic base.", minutes: 3, chips: ["Nose-breathing pace", "150 min / week", "Walk, cycle, swim"] },
        { title: "Daily steps", blurb: "Low-intensity movement through the day adds up fast.", minutes: 2, chips: ["7–10k steps", "Movement snacks", "Stand & stretch hourly"] },
      ]},
      { name: "Sleep & Light", topics: [
        { title: "Morning sunlight", blurb: "Bright light early sets your body clock for the day.", minutes: 2, chips: ["10 min outdoors", "No sunglasses", "Even on cloudy days"] },
        { title: "Wind-down routine", blurb: "Signal safety to your nervous system before bed.", minutes: 3, chips: ["Dim lights at dusk", "Cool, dark room", "Consistent bedtime"] },
        { title: "Caffeine timing", blurb: "Caffeine lingers for hours and can blunt deep sleep.", minutes: 2, chips: ["Cut off by noon–2pm", "Delay first cup", "Hydrate first"] },
      ]},
      { name: "Mitochondria & Recovery", topics: [
        { title: "Mitochondrial health", blurb: "Your cells' power plants respond to movement, light and food.", minutes: 4, chips: ["Exercise builds them", "Avoid chronic overfeeding", "Sleep repairs them"] },
        { title: "Hot & cold exposure", blurb: "Sauna and cold plunges as hormetic stressors.", minutes: 3, chips: ["Start short", "Not right after lifting", "Check with your doctor"] },
        { title: "Breath for calm", blurb: "Slow exhales shift you into rest-and-digest.", minutes: 2, chips: ["Physiological sigh", "Box breathing", "4–6 breaths / min"] },
        { title: "Stress & mind", blurb: "Mental wellbeing is physical too — protect it daily.", minutes: 3, chips: ["Time in nature", "Social connection", "Short meditations"] },
      ]},
    ],
  },
  {
    slug: "supplements", title: "Supplements", tagline: "Fill gaps, not cabinets.",
    intro: "Evidence-minded guides to common supplements and adaptogens. Food first — supplements second.",
    trays: [
      { name: "Common Gaps", topics: [
        { title: "Vitamin D3 + K2", blurb: "Many people run low, especially in winter or indoors.", minutes: 3, chips: ["Test your levels", "Take with fat", "K2 pairs well"] },
        { title: "Magnesium", blurb: "Involved in 300+ reactions; forms differ in effect.", minutes: 3, chips: ["Glycinate for sleep", "Citrate for digestion", "Evening dose"] },
        { title: "Omega-3s", blurb: "EPA and DHA support heart, brain and inflammation balance.", minutes: 3, chips: ["Oily fish 2x / week", "Check freshness", "Algae option"] },
        { title: "Creatine", blurb: "One of the most studied supplements — for muscle and brain.", minutes: 2, chips: ["3–5 g daily", "Monohydrate", "No loading needed"] },
      ]},
      { name: "Adaptogens", topics: [
        { title: "Ashwagandha", blurb: "Traditionally used to support stress resilience and sleep.", minutes: 3, chips: ["Cycle use", "Not in pregnancy", "Evening friendly"] },
        { title: "Rhodiola", blurb: "Linked to reduced fatigue during stressful periods.", minutes: 2, chips: ["Morning dose", "Short-term use", "Start low"] },
        { title: "Medicinal mushrooms", blurb: "Lion's mane, reishi and cordyceps — what we know so far.", minutes: 4, chips: ["Fruiting body extracts", "Look for testing", "Evidence still emerging"] },
      ]},
      { name: "Buying Smart", topics: [
        { title: "Third-party testing", blurb: "How to tell a quality product from a marketing one.", minutes: 3, chips: ["NSF / USP seals", "Batch certificates", "Avoid proprietary blends"] },
        { title: "Probiotic supplements", blurb: "Strain-specific benefits — not all probiotics are equal.", minutes: 3, chips: ["Match strain to goal", "CFU isn't everything", "Storage matters"] },
        { title: "Safety first", blurb: "Interactions with medications and when to talk to a professional.", minutes: 2, chips: ["Tell your doctor", "One change at a time", "More isn't better"] },
      ]},
    ],
  },
];

export const quickWins = ["Get morning light", "Eat 30 plants a week", "Lift something heavy", "Walk after meals", "Protein at breakfast", "Screens off an hour before bed", "Drink a fermented food", "Breathe slowly for 2 min"];
