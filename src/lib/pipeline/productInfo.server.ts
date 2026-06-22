import { tavilySearch } from "./tavilySearch.server";
import { scrapePageText } from "./htmlText.server";
import { askClaude, parseClaudeJson } from "./anthropic.server";

// Ported from find_product_pages() / extract_product_info_from_text() /
// auto_extract_product_info() in the notebook.
//
// DROPPED vs. the original: the vision fallback (extract_product_info_from_image)
// and the screenshot step entirely — both depended on Playwright. If static
// text scraping comes back thin, this version just works with what it has
// rather than falling back to a screenshot + vision call.

const SKIP_DOMAINS = [
  "amazon.",
  "reddit.",
  "youtube.",
  "instagram.",
  "facebook.",
  "pinterest.",
  "tiktok.",
  "wikipedia.",
];

const INGREDIENT_DBS = ["incidecoder.com", "skincarisma.com", "cosdna.com"];

export async function findProductPages(userQuery: string, maxResults = 6): Promise<string[]> {
  const searchQueries = [`${userQuery} ingredients`, `${userQuery} INCI ingredients list`];

  const urls: string[] = [];
  for (const q of searchQueries) {
    const results = await tavilySearch(q, maxResults);
    for (const r of results) {
      if (!r.url) continue;
      if (SKIP_DOMAINS.some((d) => r.url.includes(d))) continue;
      if (!urls.includes(r.url)) urls.push(r.url);
    }
  }

  // Ingredient databases carry the full INCI list in clean static HTML —
  // float them to the front so they survive the top-3 cut.
  urls.sort((a, b) => {
    const aScore = INGREDIENT_DBS.some((d) => a.includes(d)) ? 0 : 1;
    const bScore = INGREDIENT_DBS.some((d) => b.includes(d)) ? 0 : 1;
    return aScore - bScore;
  });

  return urls.slice(0, 8);
}

export type SubjectType = "product" | "practice" | "unknown";

export interface ProductInfo {
  subject_type: SubjectType;
  subject: string;
  claim: string;
  ingredients: string[];
  ingredient_benefits: Record<string, string>;
  mechanisms: string[];
  confidence: "high" | "medium" | "low";
  notes: string;
  source_urls: string[];
}

interface RawProductInfo {
  subject_type?: string;
  subject?: string;
  claim?: string;
  ingredients?: string[];
  ingredient_benefits?: Record<string, string>;
  mechanisms?: string[];
  confidence?: string;
  notes?: string;
}

export async function extractProductInfoFromText(
  userQuery: string,
  scrapedTexts: string[],
): Promise<ProductInfo> {
  const combinedText = scrapedTexts.join("\n\n").slice(0, 45000);
  const prompt = `You are extracting product evidence information for Veda.
User query:
${userQuery}
Website text:
${combinedText}
Return valid JSON only:
{
  "subject_type": "product or practice",
  "subject": "the product name OR the practice name (e.g. 'cold water immersion')",
  "claim": "the effect being evaluated, phrased neutrally (e.g. 'lowers cortisol / reduces stress')",
  "ingredients": [],
  "ingredient_benefits": {},
  "mechanisms": [],
  "confidence": "high/medium/low",
  "notes": ""
}
Rules:
- subject_type is "product" whenever an ingredient list (INCI) is present in the text. Only use "practice" when there is NO product and NO ingredients (cold plunging, fasting, sauna, breathwork, etc.). A named branded item like a lip mask, cream, or serum is ALWAYS a product, never a practice.
- subject is the specific product being evaluated (e.g. "Laneige Lip Sleeping Mask"), not a generic category ("overnight lip masks").
- claim is the effect/benefit being evaluated, stated neutrally - NOT attributed to a brand.
- Extract the FULL ingredient list when one is present (INCI lists, "Ingredients:" blocks). Do NOT limit to "key actives" - capture every ingredient you can read, in order.
- Ignore site navigation, promotions, rewards, shipping, and login text; extract only from the product/ingredient content.
- Always populate mechanisms (how the subject plausibly produces the claimed effect).`;

  const raw = await askClaude(prompt, 1000);
  const parsed = parseClaudeJson<RawProductInfo>(raw);

  if (parsed) {
    return {
      subject_type: (parsed.subject_type as SubjectType) ?? "product",
      subject: parsed.subject ?? "",
      claim: parsed.claim ?? userQuery,
      ingredients: parsed.ingredients ?? [],
      ingredient_benefits: parsed.ingredient_benefits ?? {},
      mechanisms: parsed.mechanisms ?? [],
      confidence: (parsed.confidence as ProductInfo["confidence"]) ?? "low",
      notes: parsed.notes ?? "",
      source_urls: [],
    };
  }

  return {
    subject_type: "product",
    subject: "",
    claim: userQuery,
    ingredients: [],
    ingredient_benefits: {},
    mechanisms: [],
    confidence: "low",
    notes: raw,
    source_urls: [],
  };
}

export async function autoExtractProductInfo(userQuery: string): Promise<ProductInfo> {
  const urls = await findProductPages(userQuery);

  if (urls.length === 0) {
    return {
      subject_type: "unknown",
      subject: userQuery,
      claim: userQuery,
      ingredients: [],
      ingredient_benefits: {},
      mechanisms: [],
      confidence: "low",
      notes: "No product pages retrieved (search returned nothing).",
      source_urls: [],
    };
  }

  const candidateUrls = urls.slice(0, 3);
  const scrapedTexts = (await Promise.all(candidateUrls.map((u) => scrapePageText(u)))).filter(
    Boolean,
  );

  const info = await extractProductInfoFromText(userQuery, scrapedTexts);
  info.source_urls = urls;
  return info;
}
