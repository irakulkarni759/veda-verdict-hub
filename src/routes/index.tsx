import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchBar } from "@/components/SearchBar";
import { CATEGORIES, getTrendingNow, TRENDS } from "@/data/trends";
import { getGeneratedCorpusStats } from "@/lib/getGeneratedTrend.server";
import { VERDICT_META } from "@/lib/verdict";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veda — Wellness trends, weighed against the evidence" },
      {
        name: "description",
        content:
          "Search any wellness, skincare, or haircare trend and see if it's evidence-backed, mixed, or debunked.",
      },
    ],
  }),
  loader: async () => {
    const stats = await (
      getGeneratedCorpusStats as unknown as () => Promise<{
        total: number;
        backed: number;
        mixed: number;
        debunked: number;
      }>
    )();
    return { stats };
  },
  component: HomePage,
});

function HomePage() {
  const trending = getTrendingNow().slice(0, 4);
  const { stats } = Route.useLoaderData() as {
    stats: { total: number; backed: number; mixed: number; debunked: number };
  };
  const total = TRENDS.length + stats.total;
  const backed = TRENDS.filter((t) => t.verdict === "backed").length + stats.backed;
  const debunked = TRENDS.filter((t) => t.verdict === "debunked").length + stats.debunked;
  const mixed = TRENDS.filter((t) => t.verdict === "mixed").length + stats.mixed;

  // marquee strip
  const marqueeItems = TRENDS.slice(0, 14);

  return (
    <div className="min-h-[100svh] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold sm:text-2xl">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-ink" />
          veda
        </Link>
        <div className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:flex">
          <span>Evidence</span>
          <span aria-hidden>·</span>
          <span>Sentiment</span>
          <span aria-hidden>·</span>
          <span>Verdict</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          v1.0
        </span>
      </header>

      {/* Bento — fills the viewport, no scroll on desktop */}
      <main className="flex-1 px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-6">
          {/* Hero + search — big cell */}
          <section className="paper-card relative overflow-hidden p-6 sm:p-8 lg:col-span-8 lg:row-span-4 animate-veda-in">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-veda-pulse rounded-full bg-[#1f7a4d]" />
                  Evidence engine
                </span>
                <h1 className="font-display mt-5 text-balance text-3xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
                  Every wellness trend,
                  <br />
                  <span className="text-muted-foreground">weighed against</span>
                  <br />
                  <span className="underline decoration-ink decoration-4 underline-offset-4">
                    the evidence.
                  </span>
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Search an ingredient or practice. Get a single, honest verdict
                  drawn from research and community sentiment.
                </p>
              </div>

              <div>
                <SearchBar size="hero" autoFocus />
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <Legend color="#1f7a4d" label="Backed" />
                  <Legend color="#b8851f" label="Mixed" />
                  <Legend color="#c0432b" label="Debunked" />
                  <Legend color="#2f5d8a" label="Unmapped" />
                </div>
              </div>
            </div>
          </section>

          {/* Stats — ink card */}
          <section className="ink-card ink-card-hover p-5 lg:col-span-4 lg:row-span-2 animate-veda-in">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                The corpus
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                live
              </span>
            </div>
            <div className="mt-3 font-display text-5xl font-bold tracking-tight sm:text-6xl">
              {total}
              <span className="ml-1 text-2xl text-paper/50">trends</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
              <StatPill label="Backed" value={backed} color="#54e0a8" />
              <StatPill label="Mixed" value={mixed} color="#f0b04a" />
              <StatPill label="Debunked" value={debunked} color="#ef6a4d" />
            </div>
          </section>

          {/* Trending — right column */}
          <section className="paper-card flex flex-col p-5 lg:col-span-4 lg:row-span-4 animate-veda-in">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Looking up now
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                this week
              </span>
            </div>
            <ul className="mt-3 flex flex-1 flex-col gap-1.5 overflow-hidden">
              {trending.map((t, i) => {
                const meta = VERDICT_META[t.verdict];
                return (
                  <li key={t.id}>
                    <Link
                      to="/trend/$id"
                      params={{ id: t.id }}
                      className="group flex items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 transition-all hover:border-ink/15 hover:bg-paper-2"
                    >
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 truncate font-display text-sm font-semibold text-foreground sm:text-base">
                        {t.name}
                      </span>
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: meta.color }}
                        aria-hidden
                      />
                      <span
                        className="font-mono text-[9px] uppercase tracking-[0.16em]"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              to="/category/$slug"
              params={{ slug: "skincare" }}
              className="mt-2 inline-flex items-center justify-between rounded-xl border border-ink/15 bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-ink hover:text-paper"
            >
              See all trends
              <span aria-hidden>→</span>
            </Link>
          </section>

          {/* Categories grid — bottom wide */}
          <section className="lg:col-span-8 lg:row-span-2 animate-veda-in">
            <div className="mb-2 flex items-baseline justify-between px-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Explore by domain
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                8 categories
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group paper-card paper-card-hover flex flex-col items-center justify-center gap-1 p-3 text-center"
                >
                  <span
                    className="font-display text-2xl text-ink transition-transform duration-300 group-hover:scale-110"
                    aria-hidden
                  >
                    {c.icon}
                  </span>
                  <span className="font-display text-[11px] font-semibold leading-tight text-foreground sm:text-xs">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Marquee strip — passive motion */}
      <footer className="overflow-hidden border-t border-ink/10 bg-ink py-2.5 text-paper">
        <div className="flex w-max animate-veda-marquee gap-8 font-mono text-[11px] uppercase tracking-[0.22em]">
          {[...marqueeItems, ...marqueeItems].map((t, i) => {
            const meta = VERDICT_META[t.verdict];
            return (
              <span key={i} className="flex shrink-0 items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: meta.color }}
                />
                {t.name}
                <span className="text-paper/40">· {meta.label}</span>
              </span>
            );
          })}
        </div>
      </footer>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-paper/15 bg-paper/5 px-2 py-1.5">
      <div className="flex items-center gap-1.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        <span className="text-paper/60">{label}</span>
      </div>
      <div className="mt-0.5 font-display text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}
