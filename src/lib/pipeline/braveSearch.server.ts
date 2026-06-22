// Replaces the notebook's `ddgs_text_safe()`. DDGS scrapes DuckDuckGo's HTML
// directly, which works locally but is fragile and not something to lean on
// from a server's IP in production. Brave Search has a real API with a free
// tier (2,000 queries/month at last check) — get a key at
// https://api.search.brave.com/app/keys

export interface SearchResult {
  url: string;
  title: string;
  description?: string;
}

function getBraveKey(): string {
  const key = process.env.BRAVE_SEARCH_API_KEY;
  if (!key) {
    throw new Error(
      "BRAVE_SEARCH_API_KEY is not set. Add it as a server secret in your deployment settings.",
    );
  }
  return key;
}

interface BraveWebResult {
  url: string;
  title: string;
  description?: string;
}

interface BraveSearchResponse {
  web?: { results?: BraveWebResult[] };
}

/**
 * Search the web via Brave Search. Fails soft (returns []) on error —
 * mirrors the notebook's ddgs_text_safe, which surfaces failures via DEBUG
 * logging rather than throwing, since a single failed query shouldn't kill
 * the whole pipeline run.
 */
export async function braveSearch(query: string, count = 6, retries = 2): Promise<SearchResult[]> {
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", query);
  url.searchParams.set("count", String(Math.min(count, 20)));

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": getBraveKey(),
        },
        signal: AbortSignal.timeout(15000),
      });

      if (res.status === 429 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        continue;
      }
      if (!res.ok) return [];

      const json = (await res.json()) as BraveSearchResponse;
      const results = json.web?.results ?? [];
      return results.map((r) => ({ url: r.url, title: r.title, description: r.description }));
    } catch {
      if (attempt === retries) return [];
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  return [];
}
