import { Link } from "@tanstack/react-router";
import { CATEGORIES, getTrendsByCategory, type CategorySlug } from "@/data/trends";
import { cn } from "@/lib/utils";

interface CategoryTileProps {
  slug: CategorySlug;
  className?: string;
  compact?: boolean;
}

export function CategoryTile({ slug, className, compact }: CategoryTileProps) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  const count = getTrendsByCategory(slug).length;

  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className={cn(
        "group paper-card paper-card-hover relative flex flex-col justify-between overflow-hidden text-left animate-veda-in",
        compact ? "p-3 gap-1" : "p-4 gap-2",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-display text-2xl text-ink transition-transform duration-300 group-hover:scale-110"
          aria-hidden
        >
          {cat.icon}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {count}
        </span>
      </div>
      <div>
        <div className="font-display text-sm font-semibold text-foreground sm:text-base">
          {cat.name}
        </div>
        {!compact && (
          <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            {cat.blurb}
          </div>
        )}
      </div>
    </Link>
  );
}
