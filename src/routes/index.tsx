import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchBar } from "@/components/SearchBar";
import { CATEGORIES, getTrendingNow, TRENDS } from "@/data/trends";
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
  component: HomePage,
});

function HomePage() {
  const trending = getTrendingNow().slice(0, 5);
  const total = TRENDS.length;
  const backed = TRENDS.filter((t) => t.verdict === "backed").length;
  const debunked = TRENDS.filter((t) => t.verdict === "debunked").length;
  const mixed = TRENDS.filter((t) => t.verdict === "mixed").length;

  // marquee strip
  const marqueeItems = TRENDS.slice(0, 14);

  return (
    <div className="min-h-[100svh] flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 px-5 pt-4 sm:px-8 sm:pt-5">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-xl font-bold sm:text-2xl">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-ink" />
          veda
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-x-2 overflow-hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground lg:flex">
          {CATEGORIES.map((c, i) => [
            <span key={`${c.slug}-dot`} aria-hidden className={i === 0 ? "hidden" : ""}>·</span>,
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="transition-colors hover:text-ink"
            >
              {c.name}
            </Link>,
          ])}
        </nav>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          v1.0
        </span>
      </header>

      {/* Main — single viewport, no scroll */}
      <main className="flex-1 px-4 pb-3 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
        <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-3 lg:grid-cols-12 lg:grid-rows-1">
          {/* Hero + search */}
          <section className="paper-card relative flex flex-col justify-between overflow-hidden p-5 sm:p-7 lg:col-span-7 animate-veda-in">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-veda-pulse rounded-full bg-[#1f7a4d]" />
                Evidence engine
              </span>
              <h1 className="font-display mt-4 text-balance text-[2rem] font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
                Every wellness trend,
                <br />
                <span className="text-muted-foreground">weighed against</span>
                <br />
                <span className="underline decoration-ink decoration-4 underline-offset-4">
                  the evidence.
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Search an ingredient or practice. Get a single, honest verdict
                drawn from research and community sentiment.
              </p>
            </div>

            <div className="mt-6">
              <SearchBar size="hero" autoFocus />
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <Legend color="#1f7a4d" label="Backed" />
                <Legend color="#b8851f" label="Mixed" />
                <Legend color="#c0432b" label="Debunked" />
                <Legend color="#2f5d8a" label="Unmapped" />
              </div>
            </div>
          </section>

          {/* Right column */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {/* Stats — ink card */}
            <section className="ink-card ink-card-hover p-5 animate-veda-in">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                  The corpus
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                  live
                </span>
              </div>
              <div className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {total}
                <span className="ml-1.5 text-xl text-paper/50">trends</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                <StatPill label="Backed" value={backed} color="#54e0a8" />
                <StatPill label="Mixed" value={mixed} color="#f0b04a" />
                <StatPill label="Debunked" value={debunked} color="#ef6a4d" />
              </div>
            </section>

            {/* Trending — right column */}
            <section className="paper-card flex flex-col p-5 sm:min-h-0 lg:min-h-0 animate-veda-in">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Most popular this week
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  trending
                </span>
              </div>
              <ul className="mt-3 flex flex-1 flex-col gap-1 overflow-hidden">
                {trending.map((t, i) => {
                  const meta = VERDICT_META[t.verdict];
                  return (
                    <li key={t.id}>
                      <Link
                        to="/trend/$id"
                        params={{ id: t.id }}
                        className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 transition-all hover:border-ink/15 hover:bg-paper-2"
                      >
                        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 truncate font-display text-sm font-semibold text-foreground">
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
          </div>
        </div>
      </main>

      {/* Marquee strip — passive motion */}
      <footer className="overflow-hidden border-t border-ink/10 bg-ink py-2 text-paper">
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
      <div className="mt-0.5 font-display text-base font-bold tabular-nums sm:text-lg">{value}</div>
    </div>
  );
}
