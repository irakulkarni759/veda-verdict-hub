import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { TrendCard } from "@/components/TrendCard";
import {
  getCategory,
  getTrendsByCategory,
  type CategorySlug,
  type Verdict,
} from "@/data/trends";
import { VERDICT_FILTERS } from "@/lib/verdict";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const cat = getCategory(params.slug);
    const title = cat ? `${cat.name} — Veda` : "Category — Veda";
    const desc = cat
      ? `Browse ${cat.name.toLowerCase()} trends and see which are evidence-backed, mixed, or debunked.`
      : "Browse wellness trends by category.";
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
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { category: cat };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-display text-3xl italic">Category not found</h1>
        <Link to="/" className="mt-4 inline-block font-mono text-sm text-[#54e0a8]">
          ← Back home
        </Link>
      </div>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const [filter, setFilter] = useState<"all" | Verdict>("all");
  const all = getTrendsByCategory(category.slug as CategorySlug);
  const trends = filter === "all" ? all : all.filter((t) => t.verdict === filter);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-fit font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← All categories
          </Link>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-display text-4xl text-[#8fc0ff] sm:text-5xl" aria-hidden>
                  {category.icon}
                </span>
                <h1 className="font-display truncate text-3xl font-normal italic leading-tight sm:text-5xl">
                  {category.name}
                </h1>
              </div>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {category.blurb} — {all.length} mapped trends.
              </p>
            </div>
          </div>

          {/* Filter row */}
          <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {VERDICT_FILTERS.map((f) => {
              const active = filter === f.value;
              const count =
                f.value === "all" ? all.length : all.filter((t) => t.verdict === f.value).length;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-all",
                    active
                      ? "border-[#54e0a8]/60 bg-[#54e0a8]/10 text-[#54e0a8] shadow-[0_0_20px_-6px_rgba(84,224,168,0.5)]"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground",
                  )}
                >
                  {f.label}
                  <span className="ml-2 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {trends.length === 0 ? (
          <div className="glass-card mt-12 p-10 text-center">
            <p className="font-display text-xl italic text-muted-foreground">
              No trends match this filter.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {trends.map((t) => (
              <TrendCard key={t.id} trend={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
