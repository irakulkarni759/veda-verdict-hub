import { createFileRoute, Link } from "@tanstack/react-router";
import { Starfield } from "@/components/Starfield";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTile } from "@/components/CategoryTile";
import { TrendCard } from "@/components/TrendCard";
import { CATEGORIES, getTrendingNow } from "@/data/trends";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veda — Wellness trends, weighed against the evidence" },
      {
        name: "description",
        content:
          "Search any wellness, skincare, or haircare trend and see if it's evidence-backed, mixed, or debunked.",
      },
      { property: "og:title", content: "Veda — Evidence for wellness trends" },
      {
        property: "og:description",
        content:
          "Every wellness trend, weighed against the evidence. Search products and practices and see what the research really says.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const trending = getTrendingNow();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero starfield */}
      <section className="relative isolate flex min-h-[100svh] flex-col">
        <div className="absolute inset-0 -z-10">
          <Starfield className="h-full w-full" intensity="hero" />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#05060d]"
          />
        </div>

        {/* Top wordmark */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-7">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-semibold sm:text-2xl"
          >
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-[#54e0a8] shadow-[0_0_18px_2px_rgba(84,224,168,0.7)]"
            />
            <span className="italic">veda</span>
          </Link>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            Evidence · Sentiment · Verdict
          </span>
        </div>

        {/* Hero content */}
        <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pb-20 pt-6 text-center sm:px-6 sm:pb-28">
          <span className="animate-veda-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-veda-pulse rounded-full bg-[#54e0a8]" />
            Evidence engine · v1
          </span>

          <h1 className="font-display animate-veda-in text-balance text-4xl font-normal leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            <span className="italic">Every wellness trend,</span>
            <br />
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              weighed against the evidence.
            </span>
          </h1>

          <p className="animate-veda-in mx-auto mt-5 max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:mt-7 sm:text-base">
            Veda cross-references ingredients and practices against research and
            community sentiment, then delivers a single, color-coded verdict.
          </p>

          <div className="animate-veda-in mt-8 flex w-full justify-center sm:mt-10">
            <SearchBar size="hero" autoFocus />
          </div>

          <div className="animate-veda-in mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 sm:text-[11px]">
            <Legend color="#54e0a8" label="Backed" />
            <Legend color="#f0b04a" label="Mixed" />
            <Legend color="#ef6a4d" label="Debunked" />
            <Legend color="#8fc0ff" label="Unmapped" />
          </div>
        </div>
      </section>

      {/* Trending now strip */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <SectionHeader
          eyebrow="Trending now"
          title="What people are looking up this week"
        />
        <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <div className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-4 sm:grid-flow-row sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {trending.map((t) => (
              <TrendCard key={t.id} trend={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
        <SectionHeader
          eyebrow="Browse by category"
          title="Explore the constellation"
          subtitle="Eight domains where wellness claims collide with science. Tap any to see the trends inside."
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryTile key={c.slug} slug={c.slug} />
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 px-4 py-8 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:py-10">
        Veda · Mock data for illustration. Not medical advice.
      </footer>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      {label}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8fc0ff]">
        {eyebrow}
      </span>
      <h2 className="font-display text-2xl font-normal leading-tight text-foreground sm:text-4xl">
        <span className="italic">{title}</span>
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
