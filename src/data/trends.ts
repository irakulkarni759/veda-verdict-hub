export type Verdict = "backed" | "mixed" | "debunked" | "unmapped";

export type CategorySlug =
  | "skincare"
  | "haircare"
  | "supplements"
  | "nutrition"
  | "fitness"
  | "sleep"
  | "gut-health"
  | "mental-wellness";

export interface Trend {
  id: string;
  name: string;
  category: CategorySlug;
  verdict: Verdict;
  summary: string;
  studyCount: number;
  confidence: "low" | "moderate" | "high";
  lastUpdated: string; // ISO date
  evidencePoints: string[];
  sentimentScore: number; // -1..1
  opinions: { handle: string; text: string }[];
  relatedIds: string[];
}

export const CATEGORIES: {
  slug: CategorySlug;
  name: string;
  icon: string;
  blurb: string;
}[] = [
  { slug: "skincare", name: "Skincare", icon: "✺", blurb: "Acids, actives, sunscreens" },
  { slug: "haircare", name: "Haircare", icon: "❋", blurb: "Growth, scalp, treatments" },
  { slug: "supplements", name: "Supplements", icon: "◎", blurb: "Pills, powders, peptides" },
  { slug: "nutrition", name: "Nutrition", icon: "❖", blurb: "Diets, fasting, foods" },
  { slug: "fitness", name: "Fitness", icon: "△", blurb: "Training & performance" },
  { slug: "sleep", name: "Sleep", icon: "☾", blurb: "Rest, recovery, rituals" },
  { slug: "gut-health", name: "Gut Health", icon: "◍", blurb: "Microbiome, probiotics" },
  { slug: "mental-wellness", name: "Mental Wellness", icon: "✦", blurb: "Mind, mood, stress" },
];

export const TRENDS: Trend[] = [
  {
    id: "daily-sunscreen",
    name: "Daily SPF 30+ Sunscreen",
    category: "skincare",
    verdict: "backed",
    summary:
      "Daily broad-spectrum sunscreen meaningfully reduces photoaging and skin-cancer risk.",
    studyCount: 142,
    confidence: "high",
    lastUpdated: "2026-05-14",
    evidencePoints: [
      "Multiple RCTs show daily SPF use reduces visible photoaging within 12 months.",
      "Long-term cohort studies link daily use to lower rates of squamous cell carcinoma.",
      "Broad-spectrum formulas outperform UVB-only on pigmentation outcomes.",
      "Reapplication every ~2 hours sun exposure is required to retain stated SPF.",
    ],
    sentimentScore: 0.78,
    opinions: [
      { handle: "@derm_notes", text: "The single highest ROI step in any routine." },
      { handle: "@skinlab", text: "Texture has finally caught up — no more white cast." },
    ],
    relatedIds: ["retinoids", "vitamin-c-serum", "niacinamide"],
  },
  {
    id: "retinoids",
    name: "Retinoids for Wrinkles",
    category: "skincare",
    verdict: "backed",
    summary:
      "Topical retinoids reliably reduce fine lines and improve skin texture over months of use.",
    studyCount: 96,
    confidence: "high",
    lastUpdated: "2026-04-02",
    evidencePoints: [
      "Tretinoin 0.025–0.1% shows measurable wrinkle reduction at 24 weeks.",
      "Over-the-counter retinol is weaker but still effective at higher concentrations.",
      "Irritation peaks in the first 4–6 weeks and typically subsides.",
      "Pair with sunscreen — retinoids increase UV sensitivity.",
    ],
    sentimentScore: 0.62,
    opinions: [
      { handle: "@routinerev", text: "Worth pushing through the purge phase." },
      { handle: "@nightshift", text: "Game-changer after ~3 months of consistent use." },
    ],
    relatedIds: ["daily-sunscreen", "niacinamide", "vitamin-c-serum"],
  },
  {
    id: "vitamin-c-serum",
    name: "Vitamin C Serum",
    category: "skincare",
    verdict: "backed",
    summary:
      "L-ascorbic acid at 10–20% brightens, supports collagen, and boosts SPF performance.",
    studyCount: 58,
    confidence: "moderate",
    lastUpdated: "2026-03-22",
    evidencePoints: [
      "Stabilized L-ascorbic acid 10–20% improves dyspigmentation in 12-week trials.",
      "Synergizes with sunscreen against free-radical photo-damage.",
      "Formulation pH (≤3.5) is critical for skin penetration.",
    ],
    sentimentScore: 0.55,
    opinions: [
      { handle: "@formulafiles", text: "Most products oxidize fast — buy small bottles." },
    ],
    relatedIds: ["daily-sunscreen", "retinoids"],
  },
  {
    id: "niacinamide",
    name: "Niacinamide for Redness",
    category: "skincare",
    verdict: "backed",
    summary:
      "Topical niacinamide 4–5% reduces redness, sebum, and supports the skin barrier.",
    studyCount: 41,
    confidence: "moderate",
    lastUpdated: "2026-02-10",
    evidencePoints: [
      "4–5% niacinamide reduces TEWL and improves barrier function.",
      "Helps fade post-inflammatory hyperpigmentation over 8–12 weeks.",
      "Well-tolerated; mixes safely with most actives.",
    ],
    sentimentScore: 0.6,
    opinions: [{ handle: "@gentleskin", text: "Boring in the best way." }],
    relatedIds: ["retinoids", "vitamin-c-serum"],
  },
  {
    id: "gua-sha",
    name: "Gua Sha Facial Sculpting",
    category: "skincare",
    verdict: "mixed",
    summary:
      "May reduce puffiness short-term; lasting sculpting or anti-aging effects aren't proven.",
    studyCount: 9,
    confidence: "low",
    lastUpdated: "2026-01-18",
    evidencePoints: [
      "Small studies show temporary lymphatic drainage and reduced puffiness.",
      "No high-quality evidence for permanent contouring or lifting.",
      "Aggressive use can cause bruising and capillary damage.",
    ],
    sentimentScore: 0.2,
    opinions: [
      { handle: "@morningroutine", text: "Calming ritual — visible change is minor." },
    ],
    relatedIds: ["jade-roller", "lymphatic-massage"],
  },
  {
    id: "jade-roller",
    name: "Jade Roller",
    category: "skincare",
    verdict: "mixed",
    summary: "Pleasant and cooling, but evidence for real skin benefit is thin.",
    studyCount: 4,
    confidence: "low",
    lastUpdated: "2025-11-30",
    evidencePoints: [
      "Cold massage can briefly reduce puffiness.",
      "No clinical evidence of collagen stimulation.",
    ],
    sentimentScore: 0.1,
    opinions: [{ handle: "@skinlab", text: "More vibe than treatment." }],
    relatedIds: ["gua-sha"],
  },
  {
    id: "snail-mucin",
    name: "Snail Mucin Essence",
    category: "skincare",
    verdict: "mixed",
    summary:
      "Promising for hydration and wound healing, but human trials are still small.",
    studyCount: 17,
    confidence: "low",
    lastUpdated: "2026-03-04",
    evidencePoints: [
      "In vitro studies suggest collagen and elastin support.",
      "Small human trials show improved hydration and texture.",
    ],
    sentimentScore: 0.45,
    opinions: [{ handle: "@kbeauty", text: "My barrier loves it. YMMV." }],
    relatedIds: ["niacinamide"],
  },
  {
    id: "rosemary-oil-hair",
    name: "Rosemary Oil for Hair Growth",
    category: "haircare",
    verdict: "mixed",
    summary:
      "One trial showed parity with minoxidil 2%; replication is limited and quality varies.",
    studyCount: 7,
    confidence: "low",
    lastUpdated: "2026-02-25",
    evidencePoints: [
      "A 2015 trial found rosemary oil similar to minoxidil 2% at 6 months.",
      "Few replications; sample sizes small.",
      "Can irritate scalp if undiluted.",
    ],
    sentimentScore: 0.35,
    opinions: [
      { handle: "@scalpscience", text: "Worth trying if minoxidil isn't an option." },
    ],
    relatedIds: ["rice-water", "minoxidil", "hair-gummies"],
  },
  {
    id: "rice-water",
    name: "Rice Water for Hair",
    category: "haircare",
    verdict: "mixed",
    summary:
      "Tradition is rich; clinical evidence is sparse and mixed on real benefits.",
    studyCount: 5,
    confidence: "low",
    lastUpdated: "2026-01-08",
    evidencePoints: [
      "Inositol in rice water may bind to hair shaft and reduce friction.",
      "No robust trials show meaningful growth or thickness gains.",
      "Prolonged use can over-condition or stiffen hair.",
    ],
    sentimentScore: 0.15,
    opinions: [{ handle: "@curlclub", text: "Slip improves; growth claims overblown." }],
    relatedIds: ["rosemary-oil-hair", "hair-gummies"],
  },
  {
    id: "minoxidil",
    name: "Minoxidil (Topical)",
    category: "haircare",
    verdict: "backed",
    summary:
      "FDA-approved, well-studied for androgenic hair loss in both men and women.",
    studyCount: 120,
    confidence: "high",
    lastUpdated: "2026-05-01",
    evidencePoints: [
      "Multiple RCTs show density gains within 4–6 months.",
      "Effect ceases when treatment stops.",
      "Initial shedding is common and temporary.",
    ],
    sentimentScore: 0.5,
    opinions: [{ handle: "@scalpscience", text: "Boring, effective, evidence-based." }],
    relatedIds: ["rosemary-oil-hair", "hair-gummies"],
  },
  {
    id: "hair-gummies",
    name: "Hair-Growth Gummies",
    category: "haircare",
    verdict: "debunked",
    summary:
      "Most contain biotin doses without proven effect outside of true deficiency.",
    studyCount: 6,
    confidence: "moderate",
    lastUpdated: "2026-04-19",
    evidencePoints: [
      "Biotin only helps hair if you're deficient — most people aren't.",
      "High-dose biotin distorts thyroid and cardiac lab tests.",
      "Industry-funded studies often confuse marketing with evidence.",
    ],
    sentimentScore: -0.4,
    opinions: [
      { handle: "@dermtruth", text: "Save your money — better protein intake helps more." },
    ],
    relatedIds: ["minoxidil", "collagen-peptides"],
  },
  {
    id: "scalp-massage",
    name: "Scalp Massage",
    category: "haircare",
    verdict: "mixed",
    summary:
      "Daily massage may modestly increase hair thickness over months; sample sizes are small.",
    studyCount: 6,
    confidence: "low",
    lastUpdated: "2026-02-02",
    evidencePoints: [
      "A 24-week study found increased hair thickness with daily massage.",
      "Mechanism unclear — possibly mechanical stress on follicles.",
    ],
    sentimentScore: 0.3,
    opinions: [{ handle: "@curlclub", text: "Relaxing and basically free." }],
    relatedIds: ["minoxidil"],
  },
  {
    id: "collagen-peptides",
    name: "Collagen Peptides",
    category: "supplements",
    verdict: "mixed",
    summary:
      "Modest skin elasticity gains in trials, often industry-funded; benefit is real but small.",
    studyCount: 28,
    confidence: "moderate",
    lastUpdated: "2026-03-12",
    evidencePoints: [
      "Meta-analyses show small improvements in skin elasticity and hydration.",
      "Most positive trials are funded by collagen brands.",
      "Whole-protein intake may deliver similar benefits.",
    ],
    sentimentScore: 0.25,
    opinions: [
      { handle: "@nutrinotes", text: "Effect is real but small — manage expectations." },
    ],
    relatedIds: ["creatine", "ashwagandha", "vitamin-d"],
  },
  {
    id: "creatine",
    name: "Creatine Monohydrate",
    category: "supplements",
    verdict: "backed",
    summary:
      "One of the most-studied supplements: improves strength, power, and lean mass.",
    studyCount: 1100,
    confidence: "high",
    lastUpdated: "2026-05-22",
    evidencePoints: [
      "Consistent 5–15% strength gains in resistance training.",
      "Safe in long-term studies up to 5+ years.",
      "Emerging evidence for cognitive and mood support.",
    ],
    sentimentScore: 0.82,
    opinions: [{ handle: "@lifthouse", text: "Cheap, safe, works. Period." }],
    relatedIds: ["protein-timing", "ashwagandha", "vitamin-d"],
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha for Stress",
    category: "supplements",
    verdict: "mixed",
    summary:
      "Short-term stress and sleep improvements; long-term safety data is limited.",
    studyCount: 35,
    confidence: "moderate",
    lastUpdated: "2026-02-28",
    evidencePoints: [
      "Multiple trials show cortisol and stress score reductions over 8 weeks.",
      "Reports of liver toxicity in rare cases.",
      "Avoid in pregnancy and with thyroid medications.",
    ],
    sentimentScore: 0.4,
    opinions: [{ handle: "@calmlab", text: "Felt the edge come off — cycled off after 8 weeks." }],
    relatedIds: ["magnesium-glycinate", "melatonin", "creatine"],
  },
  {
    id: "vitamin-d",
    name: "Vitamin D Supplementation",
    category: "supplements",
    verdict: "backed",
    summary:
      "Useful when deficient; benefits beyond deficiency correction are limited.",
    studyCount: 220,
    confidence: "high",
    lastUpdated: "2026-04-04",
    evidencePoints: [
      "Correcting deficiency improves bone and immune outcomes.",
      "Mega-doses do not provide additional benefit and risk toxicity.",
      "Test serum 25(OH)D before high-dose use.",
    ],
    sentimentScore: 0.5,
    opinions: [{ handle: "@nutrinotes", text: "Test, don't guess." }],
    relatedIds: ["creatine", "magnesium-glycinate"],
  },
  {
    id: "celery-juice-detox",
    name: "Celery Juice Detox",
    category: "nutrition",
    verdict: "debunked",
    summary:
      "No clinical evidence supports the detox or healing claims attached to celery juice.",
    studyCount: 3,
    confidence: "high",
    lastUpdated: "2026-01-25",
    evidencePoints: [
      "Liver and kidneys handle detoxification — no juice is required.",
      "Claims around chronic illness reversal are anecdotal.",
      "Removing fiber via juicing strips one of celery's real benefits.",
    ],
    sentimentScore: -0.5,
    opinions: [
      { handle: "@evidencebites", text: "It's just expensive flavored water." },
    ],
    relatedIds: ["intermittent-fasting", "alkaline-water"],
  },
  {
    id: "intermittent-fasting",
    name: "Intermittent Fasting (16:8)",
    category: "nutrition",
    verdict: "mixed",
    summary:
      "Effective for weight loss when calories drop; not magic beyond caloric deficit.",
    studyCount: 78,
    confidence: "moderate",
    lastUpdated: "2026-03-30",
    evidencePoints: [
      "Equivalent fat loss vs. calorie-matched continuous restriction.",
      "May improve insulin sensitivity in some populations.",
      "Long fasting windows can reduce lean mass without protein focus.",
    ],
    sentimentScore: 0.3,
    opinions: [{ handle: "@metabolab", text: "It's a tool, not a miracle." }],
    relatedIds: ["creatine", "celery-juice-detox"],
  },
  {
    id: "alkaline-water",
    name: "Alkaline Water",
    category: "nutrition",
    verdict: "debunked",
    summary:
      "Body pH is tightly regulated; drinking high-pH water does not 'alkalize' you.",
    studyCount: 4,
    confidence: "high",
    lastUpdated: "2025-12-12",
    evidencePoints: [
      "Stomach acid neutralizes alkaline water within minutes.",
      "No credible studies link it to disease prevention.",
    ],
    sentimentScore: -0.3,
    opinions: [{ handle: "@evidencebites", text: "Marketing physics, not biology." }],
    relatedIds: ["celery-juice-detox"],
  },
  {
    id: "protein-timing",
    name: "Post-Workout Protein Window",
    category: "fitness",
    verdict: "mixed",
    summary:
      "The strict '30-minute window' is overstated; total daily protein matters more.",
    studyCount: 44,
    confidence: "moderate",
    lastUpdated: "2026-02-15",
    evidencePoints: [
      "Anabolic window appears to be several hours, not minutes.",
      "Total daily protein (1.6–2.2 g/kg) drives muscle protein synthesis.",
      "Distribution across meals matters more than exact timing.",
    ],
    sentimentScore: 0.35,
    opinions: [{ handle: "@lifthouse", text: "Hit your daily total, stop stressing." }],
    relatedIds: ["creatine", "zone-2-cardio"],
  },
  {
    id: "zone-2-cardio",
    name: "Zone 2 Cardio",
    category: "fitness",
    verdict: "backed",
    summary:
      "Low-intensity cardio reliably improves mitochondrial function and aerobic base.",
    studyCount: 60,
    confidence: "high",
    lastUpdated: "2026-04-22",
    evidencePoints: [
      "Improves fat oxidation and lactate threshold in trained and untrained alike.",
      "Sustainable volume — lower injury and recovery cost than HIIT.",
    ],
    sentimentScore: 0.65,
    opinions: [{ handle: "@enduro", text: "Boring miles, big returns." }],
    relatedIds: ["creatine", "protein-timing"],
  },
  {
    id: "ice-baths",
    name: "Ice Baths After Lifting",
    category: "fitness",
    verdict: "mixed",
    summary:
      "Useful for perceived recovery; can blunt hypertrophy if used immediately post-lift.",
    studyCount: 22,
    confidence: "moderate",
    lastUpdated: "2026-03-15",
    evidencePoints: [
      "Reduces soreness and perceived fatigue short-term.",
      "Repeated post-lift cold exposure may dampen muscle gains.",
      "Best separated from resistance training by 4+ hours.",
    ],
    sentimentScore: 0.2,
    opinions: [{ handle: "@coldlab", text: "Great for mood, careful around lifting." }],
    relatedIds: ["zone-2-cardio", "ashwagandha"],
  },
  {
    id: "melatonin",
    name: "Melatonin for Sleep",
    category: "sleep",
    verdict: "mixed",
    summary:
      "Helpful for jet lag and shift work; modest effect for general insomnia at low doses.",
    studyCount: 90,
    confidence: "moderate",
    lastUpdated: "2026-03-18",
    evidencePoints: [
      "Low doses (0.3–1 mg) outperform high doses for sleep onset.",
      "Most OTC products are overdosed and inconsistently labeled.",
      "Best for circadian shifts, not chronic insomnia.",
    ],
    sentimentScore: 0.25,
    opinions: [{ handle: "@sleepwise", text: "Less is more — most pills are 5–10x too strong." }],
    relatedIds: ["magnesium-glycinate", "blue-light-blocking", "ashwagandha"],
  },
  {
    id: "magnesium-glycinate",
    name: "Magnesium Glycinate at Night",
    category: "sleep",
    verdict: "mixed",
    summary:
      "Helps if you're deficient or stressed; not a universal sleep aid.",
    studyCount: 24,
    confidence: "moderate",
    lastUpdated: "2026-02-08",
    evidencePoints: [
      "Mild improvements in subjective sleep quality in older adults.",
      "Glycinate form is gentler on the gut than citrate.",
    ],
    sentimentScore: 0.4,
    opinions: [{ handle: "@sleepwise", text: "Stack-friendly, low downside." }],
    relatedIds: ["melatonin", "ashwagandha"],
  },
  {
    id: "blue-light-blocking",
    name: "Blue-Light Blocking Glasses",
    category: "sleep",
    verdict: "mixed",
    summary:
      "Evidence for sleep benefit is weaker than marketing implies; ambient light matters more.",
    studyCount: 18,
    confidence: "low",
    lastUpdated: "2026-01-30",
    evidencePoints: [
      "Some studies show slight melatonin preservation.",
      "Other RCTs find no meaningful sleep improvement.",
      "Dimming screens and lights has a larger effect.",
    ],
    sentimentScore: 0.05,
    opinions: [{ handle: "@nightshift", text: "Helpful prop, not a fix." }],
    relatedIds: ["melatonin"],
  },
  {
    id: "probiotics-general",
    name: "Daily Probiotic Supplements",
    category: "gut-health",
    verdict: "mixed",
    summary:
      "Strain-specific benefits exist; generic 'gut health' probiotics are overpromised.",
    studyCount: 65,
    confidence: "moderate",
    lastUpdated: "2026-03-08",
    evidencePoints: [
      "Some strains help antibiotic-associated diarrhea and IBS subtypes.",
      "Generic capsules rarely match strains in clinical trials.",
      "Fermented foods are a sensible default.",
    ],
    sentimentScore: 0.2,
    opinions: [{ handle: "@gutfacts", text: "Strain matters. CFU on a label isn't enough." }],
    relatedIds: ["fiber-intake", "celery-juice-detox"],
  },
  {
    id: "fiber-intake",
    name: "30g Fiber Per Day",
    category: "gut-health",
    verdict: "backed",
    summary:
      "Higher fiber intake links to better gut health, metabolic markers, and longevity.",
    studyCount: 180,
    confidence: "high",
    lastUpdated: "2026-04-12",
    evidencePoints: [
      "Large cohort studies link 25–30g/day to lower all-cause mortality.",
      "Soluble fiber improves cholesterol and glucose response.",
      "Plant diversity (≥30 plants/week) supports microbiome diversity.",
    ],
    sentimentScore: 0.7,
    opinions: [{ handle: "@gutfacts", text: "The closest thing to a free lunch." }],
    relatedIds: ["probiotics-general", "intermittent-fasting"],
  },
  {
    id: "mindfulness-meditation",
    name: "Mindfulness Meditation",
    category: "mental-wellness",
    verdict: "backed",
    summary:
      "Consistent practice meaningfully reduces stress, anxiety, and rumination.",
    studyCount: 200,
    confidence: "high",
    lastUpdated: "2026-04-28",
    evidencePoints: [
      "Meta-analyses show medium effect sizes for anxiety and depression.",
      "8-week MBSR programs are best-studied.",
      "App-based programs work when used consistently.",
    ],
    sentimentScore: 0.6,
    opinions: [{ handle: "@calmlab", text: "Consistency over duration." }],
    relatedIds: ["ashwagandha", "zone-2-cardio"],
  },
  {
    id: "manifestation-369",
    name: "369 Manifestation Method",
    category: "mental-wellness",
    verdict: "debunked",
    summary:
      "No scientific basis. May modestly help via goal-clarifying, not metaphysics.",
    studyCount: 0,
    confidence: "high",
    lastUpdated: "2026-01-05",
    evidencePoints: [
      "No peer-reviewed evidence supports the underlying claim.",
      "Any benefit likely overlaps with journaling and goal-setting research.",
    ],
    sentimentScore: -0.2,
    opinions: [
      { handle: "@evidencebites", text: "Journaling with extra steps and pseudoscience." },
    ],
    relatedIds: ["mindfulness-meditation"],
  },
];

export function getTrend(id: string) {
  return TRENDS.find((t) => t.id === id);
}

export function getTrendsByCategory(slug: CategorySlug) {
  return TRENDS.filter((t) => t.category === slug);
}

export function searchTrends(q: string): Trend[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return TRENDS.filter(
    (t) =>
      t.name.toLowerCase().includes(query) ||
      t.summary.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query),
  );
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTrendingNow(): Trend[] {
  return [
    "daily-sunscreen",
    "rosemary-oil-hair",
    "creatine",
    "celery-juice-detox",
    "ashwagandha",
    "gua-sha",
  ]
    .map((id) => TRENDS.find((t) => t.id === id))
    .filter((t): t is Trend => Boolean(t));
}
