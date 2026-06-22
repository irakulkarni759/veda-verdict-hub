import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServiceClient } from "./supabase.server";
import { CATEGORIES, type Trend } from "@/data/trends";

// Row shape of the `generated_trends` table. Mirrors the mapping in
// verifyTrend.server.ts so the trend detail page can hydrate a generated
// trend that isn't in the static TRENDS array.
interface GeneratedTrendRow {
  id: string;
  name: string;
  category: string;
  verdict: string;
  summary: string;
  study_count: number;
  confidence: string;
  last_updated: string;
  evidence_points: string[];
  sentiment_score: number;
  opinions: { handle: string; text: string }[];
  related_ids: string[];
}

const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

function rowToTrend(row: GeneratedTrendRow): Trend {
  return {
    id: row.id,
    name: row.name,
    category: (CATEGORY_SLUGS.includes(row.category as Trend["category"])
      ? row.category
      : "supplements") as Trend["category"],
    verdict: row.verdict as Trend["verdict"],
    summary: row.summary,
    studyCount: row.study_count,
    confidence: row.confidence as Trend["confidence"],
    lastUpdated: row.last_updated,
    evidencePoints: row.evidence_points ?? [],
    sentimentScore: row.sentiment_score ?? 0,
    opinions: row.opinions ?? [],
    relatedIds: row.related_ids ?? [],
  };
}

// Look up a single generated trend by its id. Returns null when there's no
// matching row (the loader turns that into a notFound()).
export const getGeneratedTrend = createServerFn({ method: "GET" }).handler(
  async (ctx): Promise<Trend | null> => {
    const ctxData = ctx as unknown as { data: { id: unknown } };
    const id = String(ctxData.data?.id ?? "").trim();
    if (!id) return null;

    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("generated_trends")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return rowToTrend(data as GeneratedTrendRow);
  },
);
