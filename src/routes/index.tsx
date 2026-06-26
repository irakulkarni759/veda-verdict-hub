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

// Curated glyph mosaic — hand-printed feeling icons drawn from Indian decorative motifs
const MOSAIC_GLYPHS = [
  "☀", "✺", "❋", "◎", "❖", "△", "☾", "◍", "✦", "⟡", "✿", "❀",
  "☘", "✸", "✜", "◈", "✹", "❂", "❁", "⌘", "◉", "✱", "❃", "⚘",
];

function HomePage() {
  const trending = getTrendingNow().slice(0, 4);
  const { stats } = Route.useLoaderData() as {
    stats: { total: number; backed: number; mixed: number; debunked: number };
  };
  const total = TRENDS.length + stats.total;
  const backed = TRENDS.filter((t) => t.verdict === "backed").length + stats.backed;
  const debunked = TRENDS.filter((t) => t.verdict === "debunked").length + stats.debunked;
  const mixed = TRENDS.filter((t) => t.verdict === "mixed").length + stats.mixed;

  const marqueeItems = TRENDS.slice(0, 14);
  // Build mosaic tiles tied to real trends (so colors map to verdicts)
  const mosaicTrends = TRENDS.slice(0, 24);

  return (
    <div className="relative min-h-[100svh] flex flex-col">
      {/* Decorative jharokha arches in corners */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rj-arch border border-ink/15 opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rj-arch border border-ink/15 opacity-30 rotate-180"
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span
            aria-hidden
            className="inline-block h-3 w-3 rotate-45 bg-terracotta"
            style={{ borderRadius: "2px 4px 2px 4px" }}
          />
          <span className="font-display text-2xl font-semibold italic tracking-tight sm:text-3xl">
            veda
          </span>
          <span className="font-deva text-lg text-terracotta sm:text-xl" aria-hidden>
            वेद
          </span>
        </Link>
        <div className="hidden items-center gap-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:flex">
          <span>Evidence</span>
          <span aria-hidden className="text-terracotta">✦</span>
          <span>Sentiment</span>
          <span aria-hidden className="text-terracotta">✦</span>
          <span>Verdict</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          est. 2026
        </span>
      </header>

      {/* Bento */}
      <main className="relative z-10 flex-1 px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-6">
          {/* Hero */}
          <section
            className="paper-card relative overflow-hidden p-6 sm:p-8 lg:col-span-8 lg:row-span-4 animate-veda-in"
            style={{ transform: "rotate(-0.4deg)" }}
          >
            {/* faded arch behind hero */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rj-arch border-2 border-terracotta/30 opacity-60"
            />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <span
                  className="inline-flex items-center gap-2 border border-ink/30 bg-paper-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2"
                  style={{ borderRadius: "10px 14px 8px 14px" }}
                >
                  <span className="h-1.5 w-1.5 animate-veda-pulse rounded-full bg-terracotta" />
                  Veda · evidence engine
                </span>
                <h1 className="font-display mt-5 text-balance text-3xl font-medium leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
                  Every wellness ritual,
                  <br />
                  <span className="italic text-muted-foreground">weighed against</span>
                  <br />
                  <span
                    className="relative inline-block text-terracotta"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, transparent 78%, rgba(224,142,26,0.55) 78%, rgba(224,142,26,0.55) 96%, transparent 96%)",
                    }}
                  >
                    the evidence.
                  </span>
                </h1>
                <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-ink-2 sm:text-base">
                  Search an ingredient, a tonic, a practice. Get one honest verdict,
                  drawn from research and the things people whisper online.
                </p>
              </div>

              <div>
                <SearchBar size="hero" autoFocus />
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">
                  <Legend color="#0f6e6a" label="Backed" />
                  <Legend color="#c98414" label="Mixed" />
                  <Legend color="#b8442a" label="Debunked" />
                  <Legend color="#1e3a6e" label="Unmapped" />
                </div>
              </div>
            </div>
          </section>

          {/* Corpus stats — ink card with marigold trim */}
          <section
            className="ink-card ink-card-hover relative overflow-hidden p-5 lg:col-span-4 lg:row-span-2 animate-veda-in"
            style={{ transform: "rotate(0.5deg)" }}
          >
            <div
              aria-hidden
              className="absolute right-0 top-0 h-1.5 w-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #e08e1a 0 12px, #b8442a 12px 24px, #0f6e6a 24px 36px, #1e3a6e 36px 48px)",
              }}
            />
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                The corpus
              </span>
              <span className="font-deva text-xs text-marigold" aria-hidden>
                संग्रह
              </span>
            </div>
            <div className="mt-2 font-display text-5xl font-medium tracking-tight sm:text-6xl">
              {total}
              <span className="ml-1 font-sans text-2xl italic text-paper/50">trends</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
              <StatPill label="Backed" value={backed} color="#5fd1b5" />
              <StatPill label="Mixed" value={mixed} color="#f0b04a" />
              <StatPill label="Debunked" value={debunked} color="#ef8a6d" />
            </div>
          </section>

          {/* Trending list */}
          <section
            className="paper-card flex flex-col p-5 lg:col-span-4 lg:row-span-4 animate-veda-in"
            style={{ transform: "rotate(0.3deg)" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
                Looking up now
              </span>
              <span className="font-deva text-xs text-terracotta" aria-hidden>
                आज
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
                      className="group flex items-center gap-3 border border-transparent px-2.5 py-2 transition-all hover:border-ink/25 hover:bg-paper-2"
                      style={{ borderRadius: "12px 16px 10px 14px" }}
                    >
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 truncate font-display text-sm font-medium text-foreground sm:text-base">
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

            {/* Mosaic of glyph tiles — block-print wall */}
            <div className="mt-3">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
                  The wall
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  24 motifs
                </span>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {MOSAIC_GLYPHS.map((g, i) => {
                  const t = mosaicTrends[i % mosaicTrends.length];
                  const meta = VERDICT_META[t.verdict];
                  const rot = ((i * 37) % 7) - 3;
                  return (
                    <Link
                      key={i}
                      to="/trend/$id"
                      params={{ id: t.id }}
                      title={`${t.name} · ${meta.label}`}
                      className="group flex aspect-square items-center justify-center border border-ink/20 bg-paper transition-all hover:scale-110 hover:border-ink/60"
                      style={{
                        borderRadius: "6px 8px 5px 9px",
                        transform: `rotate(${rot}deg)`,
                        color: meta.color,
                      }}
                    >
                      <span className="text-base leading-none" aria-hidden>
                        {g}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Categories — marigold ribbon */}
          <section className="lg:col-span-8 lg:row-span-2 animate-veda-in">
            <div className="mb-2 flex items-baseline justify-between px-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
                Explore by domain
              </span>
              <span className="font-deva text-xs text-terracotta" aria-hidden>
                अष्ट · 8
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
              {CATEGORIES.map((c, i) => {
                const tints = [
                  "var(--marigold)",
                  "var(--terracotta)",
                  "var(--peacock)",
                  "var(--indigo-rj)",
                ];
                const tint = tints[i % tints.length];
                const rot = (i % 2 === 0 ? -1 : 1) * (0.4 + (i % 3) * 0.2);
                return (
                  <Link
                    key={c.slug}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="group paper-card paper-card-hover flex flex-col items-center justify-center gap-1 p-3 text-center"
                    style={{ transform: `rotate(${rot}deg)` }}
                  >
                    <span
                      className="font-display text-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ color: tint }}
                      aria-hidden
                    >
                      {c.icon}
                    </span>
                    <span className="font-display text-[11px] font-medium leading-tight text-foreground sm:text-xs">
                      {c.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Marquee strip */}
      <footer
        className="relative z-10 overflow-hidden border-t-2 border-ink bg-ink py-2.5 text-paper"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 60px, rgba(224,142,26,0.08) 60px 61px)",
        }}
      >
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
                <span className="text-marigold" aria-hidden>✦</span>
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
    <div
      className="border border-paper/15 bg-paper/5 px-2 py-1.5"
      style={{ borderRadius: "8px 10px 7px 11px" }}
    >
      <div className="flex items-center gap-1.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        <span className="text-paper/60">{label}</span>
      </div>
      <div className="mt-0.5 font-display text-lg font-medium tabular-nums">{value}</div>
    </div>
  );
}
