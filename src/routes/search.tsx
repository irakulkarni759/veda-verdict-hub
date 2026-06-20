import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { TopNav } from "@/components/TopNav";
import { TrendCard } from "@/components/TrendCard";
import { VerdictBadge } from "@/components/VerdictBadge";
import { searchTrends } from "@/data/trends";
import { VERDICT_META } from "@/lib/verdict";

const searchSchema = z.object({
  q: z.string().optional().default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: ({ search }) => ({
    meta: [
      { title: search.q ? `Search · "${search.q}" — Veda` : "Search — Veda" },
      {
        name: "description",
        content: "Search Veda for evidence verdicts on wellness, skincare, and haircare trends.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = searchTrends(q);
  const top = results[0];
  const rest = results.slice(1);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8fc0ff]">
            Search
          </span>
          <h1 className="font-display text-3xl font-normal italic leading-tight sm:text-5xl">
            {q ? <>Results for &ldquo;{q}&rdquo;</> : <>Type a trend to begin</>}
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {results.length} matches
          </p>
        </div>

        {!q ? (
          <div className="glass-card mt-10 p-10 text-center text-muted-foreground">
            Try searching from the bar above — "retinoids", "creatine",
            "rosemary oil"…
          </div>
        ) : results.length === 0 ? (
          <UnmappedState query={q} />
        ) : (
          <div className="mt-10 space-y-10">
            {top ? (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Strongest match
                </span>
                <FeatureMatch trendId={top.id} />
              </div>
            ) : null}

            {rest.length > 0 ? (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Other matches
                </span>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {rest.map((t) => (
                    <TrendCard key={t.id} trend={t} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}

function FeatureMatch({ trendId }: { trendId: string }) {
  // re-fetch for full data
  const trend = searchTrends("").length === 0 ? null : null;
  // simpler: use getTrend
  const t = (() => {
    return require("@/data/trends").getTrend(trendId) as
      | import("@/data/trends").Trend
      | undefined;
  })();
  if (!t) return null;
  const meta = VERDICT_META[t.verdict];
  return (
    <Link
      to="/trend/$id"
      params={{ id: t.id }}
      className={`group glass-card glass-card-hover ${meta.glowClass} mt-4 block overflow-hidden p-6 sm:p-8`}
      style={{ backgroundImage: `linear-gradient(180deg, ${meta.color}14, transparent 50%)` }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {t.category.replace("-", " ")}
          </span>
          <h2 className="font-display mt-1 text-2xl font-normal leading-tight sm:text-4xl">
            {t.name}
          </h2>
        </div>
        <VerdictBadge verdict={t.verdict} size="lg" />
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t.summary}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
        <span>{t.studyCount} studies</span>
        <span>Confidence: {t.confidence}</span>
        <span>Updated {t.lastUpdated}</span>
      </div>
    </Link>
  );
}

function UnmappedState({ query }: { query: string }) {
  const meta = VERDICT_META.unmapped;
  return (
    <div className="mt-10">
      <div
        className={`glass-card ${meta.glowClass} p-8 sm:p-10`}
        style={{ backgroundImage: `linear-gradient(180deg, ${meta.color}12, transparent 50%)` }}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              No mapping yet
            </span>
            <h2 className="font-display mt-1 truncate text-2xl font-normal italic leading-tight sm:text-4xl">
              {query}
            </h2>
          </div>
          <VerdictBadge verdict="unmapped" size="lg" />
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Not mapped yet — Veda is gathering the evidence. New trends move to a
          verdict as soon as enough quality studies and community signal
          accumulate.
        </p>
      </div>
    </div>
  );
}
