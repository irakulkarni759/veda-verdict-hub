import { Link } from "@tanstack/react-router";
import { CATEGORIES, getTrendsByCategory, type CategorySlug } from "@/data/trends";
import { cn } from "@/lib/utils";

interface CategoryTileProps {
  slug: CategorySlug;
  className?: string;
}

export function CategoryTile({ slug, className }: CategoryTileProps) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  const count = getTrendsByCategory(slug).length;

  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className={cn(
        "group glass-card glass-card-hover relative flex flex-col gap-3 overflow-hidden p-5 text-left animate-veda-in",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-[#54e0a8]/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="flex items-center justify-between">
        <span
          className="font-display text-3xl text-[#8fc0ff] transition-transform duration-500 group-hover:scale-110 group-hover:text-[#54e0a8] sm:text-4xl"
          aria-hidden
        >
          {cat.icon}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {count} trends
        </span>
      </div>
      <div>
        <div className="font-display text-lg font-semibold text-foreground sm:text-xl">
          {cat.name}
        </div>
        <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{cat.blurb}</div>
      </div>
    </Link>
  );
}
