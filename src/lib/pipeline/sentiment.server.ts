import { tavilySearch } from "./tavilySearch.server";
import { scrapePageText } from "./htmlText.server";
import { askClaude, parseClaudeJson } from "./anthropic.server";

// Ported from find_discussion_pages() / analyze_community_sentiment() in the
// notebook. The forum/affiliate heuristics are unchanged; DDGS is swapped
// for braveSearch().

const FORUM_DOMAINS = [
  "reddit.com",
  "old.reddit.com",
  "quora.com",
  "stackexchange.com",
  "forum.",
  "community.",
  "boards.",
  "talk.",
  "skincareaddiction",
];

const AFFILIATE_URL_MARKERS = [
  "srsltid=",
  "tag=",
  "aff=",
  "affiliate",
  "ref=",
  "utm_",
  "clickid",
  "skimresref",
  "/go/",
  "/recommends/",
  "redirect",
  "partner",
  "amzn.to",
  "rstyle.me",
  "shareasale",
  "/shop",
  "/buy",
  "/deal",
  "coupon",
];

const COMMERCE_DOMAINS = [
  "amazon.",
  "sephora.",
  "ulta.",
  "walmart.",
  "target.",
  "shopify",
  "/products/",
  ".myshopify.",
];

const SKIP_DOMAINS = ["youtube.", "instagram.", "facebook.", "tiktok.", "pinterest."];

function isForum(url: string): boolean {
  const u = url.toLowerCase();
  return FORUM_DOMAINS.some((d) => u.includes(d));
}

function looksAffiliate(url: string): boolean {
  const u = url.toLowerCase();
  if (COMMERCE_DOMAINS.some((d) => u.includes(d))) return true;
  return AFFILIATE_URL_MARKERS.some((m) => u.includes(m));
}

export async function findDiscussionPages(
  userQuery: string,
  maxResults = 6,
): Promise<{ forumUrls: string[]; blogUrls: string[] }> {
  // Queries biased toward honest discussion, NOT "review" (which is affiliate-bait)
  const searchQueries = [
    `site:reddit.com ${userQuery}`,
    `${userQuery} reddit worth it OR honest OR disappointed`,
    `${userQuery} my experience`,
  ];

  const forumUrls: string[] = [];
  const blogUrls: string[] = [];
  const seen = new Set<string>();

  for (const q of searchQueries) {
    const results = await tavilySearch(q, maxResults);
    for (const r of results) {
      if (!r.url || seen.has(r.url)) continue;
      if (SKIP_DOMAINS.some((d) => r.url.includes(d))) continue;
      if (looksAffiliate(r.url)) continue;
      seen.add(r.url);
      (isForum(r.url) ? forumUrls : blogUrls).push(r.url);
    }
  }

  return { forumUrls, blogUrls };
}

export interface SentimentResult {
  overall: string;
  positive_themes: string[];
  negative_themes: string[];
  quotes: string[];
  notes: string;
  source_urls: string[];
  excluded_sources: string[];
}

interface RawSentiment {
  overall?: string;
  positive_themes?: string[];
  negative_themes?: string[];
  quotes?: string[];
  notes?: string;
  excluded_sources?: string[];
}

/** Light-volume sentiment layer. Anecdotal — not evidence. Claude rates each
 * source's commercial intent and bases sentiment on genuine user content only. */
export async function analyzeCommunitySentiment(
  userQuery: string,
  maxPages = 5,
  maxBlogs = 2,
): Promise<SentimentResult> {
  const { forumUrls, blogUrls } = await findDiscussionPages(userQuery);
  const ordered = [...forumUrls, ...blogUrls.slice(0, maxBlogs)].slice(0, maxPages);

  const texts: string[] = [];
  const usedUrls: string[] = [];
  for (const url of ordered) {
    const text = await scrapePageText(url, 8000);
    if (text) {
      texts.push(`SOURCE (${isForum(url) ? "FORUM" : "BLOG"}): ${url}\n${text}`);
      usedUrls.push(url);
    }
  }

  if (texts.length === 0) {
    return {
      overall: "unknown",
      positive_themes: [],
      negative_themes: [],
      quotes: [],
      notes: "No genuine community discussion could be retrieved.",
      source_urls: [],
      excluded_sources: [],
    };
  }

  const combined = texts.join("\n\n---\n\n").slice(0, 28000);
  const prompt = `You are analyzing COMMUNITY SENTIMENT for a wellness/skincare product.
This is anecdotal user opinion - NOT scientific evidence.

The user does NOT want affiliate/sponsored/marketing content influencing the result.
Each source is tagged FORUM (likely genuine discussion) or BLOG (verify intent).

Product / query:
${userQuery}

Scraped sources:
${combined}

First, judge each source: is it genuine user discussion, or promotional/affiliate/sponsored content
(e.g. "buy now", discount codes, "best X of 2026" roundups, uniformly glowing with purchase links)?
EXCLUDE promotional sources from the sentiment, themes, and quotes. Only use genuine user opinion.

Return valid JSON only, no preamble:
{
  "overall": "positive / mostly positive / mixed / mostly negative / negative",
  "positive_themes": ["short phrases users genuinely praise"],
  "negative_themes": ["short phrases for genuine complaints / skepticism"],
  "quotes": ["2-4 short real user quotes, each under 25 words, verbatim, from GENUINE sources only"],
  "notes": "1-2 sentences: how many sources were genuine vs excluded as promotional, and overall reliability",
  "excluded_sources": ["URLs you judged promotional/affiliate and excluded"]
}

Rules:
- Base everything ONLY on genuine (non-promotional) text. Do not invent quotes.
- If a source is marketing, exclude it and note it in excluded_sources.
- If ALL sources look promotional, set overall to "unknown" and say so in notes.`;

  const raw = await askClaude(prompt, 1100);
  const parsed = parseClaudeJson<RawSentiment>(raw);

  if (!parsed) {
    return {
      overall: "unknown",
      positive_themes: [],
      negative_themes: [],
      quotes: [],
      notes: "Could not parse sentiment response.",
      source_urls: usedUrls,
      excluded_sources: [],
    };
  }

  return {
    overall: parsed.overall ?? "unknown",
    positive_themes: parsed.positive_themes ?? [],
    negative_themes: parsed.negative_themes ?? [],
    quotes: parsed.quotes ?? [],
    notes: parsed.notes ?? "",
    source_urls: usedUrls,
    excluded_sources: parsed.excluded_sources ?? [],
  };
}
