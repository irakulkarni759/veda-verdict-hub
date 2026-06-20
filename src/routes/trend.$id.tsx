import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { TrendCard } from "@/components/TrendCard";
import { VerdictBadge } from "@/components/VerdictBadge";
import { CATEGORIES, getTrend, TRENDS, type Trend } from "@/data/trends";
import { VERDICT_META } from "@/lib/verdict";

export const Route = createFileRoute("/trend/$id")({
  head: ({ params }) => {
    const t = getTrend(params.id);
    const title = t ? `${t.name} — Veda Verdict` : "Trend — Veda";
    const desc = t ? t.summary : "Evidence verdict for a wellness trend.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const trend = getTrend(params.id);
    if (!trend) throw notFound();
    return { trend };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-display text-3xl italic">Trend not found</h1>
        <Link to="/" className="mt-4 inline-block font-mono text-sm text-[#54e0a8]">
          ← Back home
        </Link>
      </div>
    </div>
  ),
  component: TrendPage,
});

function TrendPage() {
  const { trend: t } = Route.useLoaderData();
  const meta = VERDICT_META[t.verdict];
  const category = CATEGORIES.find((c) => c.slug === t.category);
  const related = t.relatedIds
    .map((id) => TRENDS.find((x) => x.id === id))
    .filter((x): x is (typeof TRENDS)[number] => Boolean(x));

  const sentimentPct = Math.round(((t.sentimentScore + 1) / 2) * 100);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-3">
          {category ? (
            <Link
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="w-fit font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
            >
              ← {category.name}
            </Link>
          ) : null}

          {/* Hero */}
          <div
            className={`glass-card ${meta.glowClass} relative mt-2 overflow-hidden p-6 sm:p-10`}
            style={{
              backgroundImage: `linear-gradient(180deg, ${meta.color}18, transparent 55%)`,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{ background: meta.color }}
            />
            <div className="relative flex flex-col gap-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {category?.name ?? t.category}
                  </span>
                  <h1 className="font-display mt-2 text-3xl font-normal leading-[1.05] sm:text-5xl md:text-6xl">
                    <span className="italic">{t.name}</span>
                  </h1>
                </div>
                <VerdictBadge verdict={t.verdict} size="lg" />
              </div>

              <p className="max-w-3xl text-base leading-relaxed text-foreground/85 sm:text-lg">
                {t.summary}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4 sm:gap-4">
                <Stat label="Studies" value={String(t.studyCount)} />
                <Stat label="Confidence" value={t.confidence} />
                <Stat label="Sentiment" value={`${sentimentPct}%`} />
                <Stat label="Updated" value={t.lastUpdated} />
              </div>
            </div>
          </div>

          {/* What the research says */}
          <section className="mt-10">
            <SectionHeader eyebrow="What the research says" />
            <ul className="mt-5 grid gap-3 sm:gap-4">
              {t.evidencePoints.map((point, i) => (
                <li
                  key={i}
                  className="glass-card flex items-start gap-4 p-5 sm:p-6"
                >
                  <span
                    className="font-mono text-xs"
                    style={{ color: meta.color }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sentiment */}
          <section className="mt-10">
            <SectionHeader eyebrow="What people say" />
            <div className="glass-card mt-5 p-6 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Community sentiment
                </span>
                <span
                  className="font-mono text-sm"
                  style={{ color: meta.color }}
                >
                  {sentimentPct}% positive
                </span>
              </div>
              <div
                className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/5"
                role="progressbar"
                aria-valuenow={sentimentPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${sentimentPct}%`,
                    background: `linear-gradient(90deg, ${meta.color}, ${meta.color}bb)`,
                    boxShadow: `0 0 18px ${meta.color}66`,
                  }}
                />
              </div>

              <div className="mt-6 grid gap-3 sm:gap-4">
                {t.opinions.map((o) => (
                  <figure
                    key={o.handle}
                    className="rounded-xl border border-white/8 bg-white/[0.03] p-4 sm:p-5"
                  >
                    <blockquote className="text-sm italic leading-relaxed text-foreground/90 sm:text-base">
                      &ldquo;{o.text}&rdquo;
                    </blockquote>
                    <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {o.handle}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Related */}
          {related.length > 0 ? (
            <section className="mt-12">
              <SectionHeader eyebrow="Related trends" />
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {related.map((r) => (
                  <TrendCard key={r.id} trend={r} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="font-mono mt-1 text-base text-foreground sm:text-lg">{value}</div>
    </div>
  );
}

function SectionHeader({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8fc0ff]">
        {eyebrow}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
    </div>
  );
}
