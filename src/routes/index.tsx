import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CATEGORIES, getTrendingNow, TRENDS } from "@/data/trends";
import { VERDICT_META } from "@/lib/verdict";
import {
  getRecentSearches,
  subscribeRecentSearches,
  SEED_SEARCHES,
  type RecentSearch,
} from "@/lib/recentSearches";

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
  const trending = getTrendingNow().slice(0, 4);
  const marqueeItems = TRENDS.slice(0, 14);

  const [recents, setRecents] = useState<RecentSearch[]>(SEED_SEARCHES);
  useEffect(() => {
    const load = () => {
      const r = getRecentSearches();
      // merge user searches in front of the seed mosaic so the wall stays full
      const merged = [
        ...r,
        ...SEED_SEARCHES.filter(
          (s) => !r.some((x) => x.q.toLowerCase() === s.q.toLowerCase()),
        ),
      ].slice(0, 24);
      setRecents(merged);
    };
    load();
    return subscribeRecentSearches(load);
  }, []);

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
            className="paper-card tile-rose relative overflow-hidden p-6 sm:p-8 lg:col-span-8 lg:row-span-4 animate-veda-in"
            style={{ transform: "rotate(-0.6deg)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rj-arch border-2 border-terracotta/40 opacity-70"
            />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <span
                  className="inline-flex items-center gap-2 border border-ink/40 bg-paper/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2"
                  style={{ borderRadius: "12px 6px 14px 8px" }}
                >
                  <span className="h-1.5 w-1.5 animate-veda-pulse rounded-full bg-terracotta" />
                  Veda · evidence engine
                </span>
                <h1 className="font-display mt-5 text-balance text-3xl font-medium leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
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
              </div>

              <div>
                <SearchBar size="hero" autoFocus />

                {/* Search format guidance */}
                <div
                  className="mt-3 flex flex-wrap items-start gap-2 border border-dashed border-ink/40 bg-paper/60 px-3 py-2"
                  style={{ borderRadius: "10px 18px 8px 16px" }}
                >
                  <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-terracotta">
                    How to ask
                  </span>
                  <p className="flex-1 min-w-[14rem] font-sans text-[12px] leading-snug text-ink-2 sm:text-[13px]">
                    Pair an ingredient or practice with a specific claim. Not just
                    "creatine" — try{" "}
                    <em className="font-display not-italic font-medium text-ink">
                      "creatine for muscle growth"
                    </em>{" "}
                    or{" "}
                    <em className="font-display not-italic font-medium text-ink">
                      "ice rolling for puffiness."
                    </em>
                  </p>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">
                  <Legend color="#0f6e6a" label="Backed" />
                  <Legend color="#c98414" label="Mixed" />
                  <Legend color="#b8442a" label="Debunked" />
                  <Legend color="#1e3a6e" label="Unmapped" />
                </div>
              </div>
            </div>
          </section>

          {/* LIVE SEARCHES — replaces the corpus card */}
          <section
            className="paper-card tile-indigo relative overflow-hidden p-5 lg:col-span-4 lg:row-span-2 animate-veda-in"
            style={{ transform: "rotate(0.7deg)" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-indigo-rj">
                Being looked up · live
              </span>
              <span className="font-deva text-xs text-indigo-rj" aria-hidden>
                अभी
              </span>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-6">
              {recents.slice(0, 18).map((r, i) => {
                const rot = ((i * 41) % 9) - 4;
                return (
                  <Link
                    key={r.q + i}
                    to="/search"
                    search={{ q: r.q }}
                    title={r.q}
                    className="group flex aspect-square items-center justify-center border-[1.5px] border-ink/30 bg-paper/80 transition-all hover:scale-110 hover:border-ink"
                    style={{
                      borderRadius: "8px 12px 6px 14px",
                      transform: `rotate(${rot}deg)`,
                      color: r.tint,
                    }}
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      {r.glyph}
                    </span>
                  </Link>
                );
              })}
            </div>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-indigo-rj/70">
              Tap a tile · new searches stitch in
            </p>
          </section>

          {/* Trending list */}
          <section
            className="paper-card tile-sage flex flex-col p-5 lg:col-span-4 lg:row-span-4 animate-veda-in"
            style={{ transform: "rotate(-0.4deg)" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-peacock">
                Trending verdicts
              </span>
              <span className="font-deva text-xs text-peacock" aria-hidden>
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
                      className="group flex items-center gap-3 border border-transparent bg-paper/50 px-2.5 py-2 transition-all hover:border-ink/40 hover:bg-paper"
                      style={{ borderRadius: "14px 8px 18px 10px" }}
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

            <div className="mt-3 border-t border-dashed border-peacock/40 pt-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-peacock/80">
                Always weighed against research + community
              </p>
            </div>
          </section>

          {/* Categories — irregular tile mix */}
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
                const tints = ["tile-saffron", "tile-rose", "tile-sage", "tile-indigo"];
                const tintClass = tints[i % tints.length];
                const colors = [
                  "var(--marigold)",
                  "var(--terracotta)",
                  "var(--peacock)",
                  "var(--indigo-rj)",
                ];
                const color = colors[i % colors.length];
                const rot = (i % 2 === 0 ? -1 : 1) * (0.6 + (i % 3) * 0.4);
                return (
                  <Link
                    key={c.slug}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className={`group paper-card paper-card-hover ${tintClass} flex flex-col items-center justify-center gap-1 p-3 text-center`}
                    style={{ transform: `rotate(${rot}deg)` }}
                  >
                    <span
                      className="font-display text-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ color }}
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
