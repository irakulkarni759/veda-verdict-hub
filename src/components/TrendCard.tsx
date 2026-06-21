import { Link } from "@tanstack/react-router";
import type { Trend } from "@/data/trends";
import { CATEGORIES } from "@/data/trends";
import { VERDICT_META } from "@/lib/verdict";
import { VerdictBadge } from "./VerdictBadge";
import { cn } from "@/lib/utils";

interface TrendCardProps {
  trend: Trend;
  className?: string;
  compact?: boolean;
}

export function TrendCard({ trend, className, compact }: TrendCardProps) {
  const meta = VERDICT_META[trend.verdict];
  const category = CATEGORIES.find((c) => c.slug === trend.category);

  return (
    <Link
      to="/trend/$id"
      params={{ id: trend.id }}
      className={cn(
        "group paper-card paper-card-hover relative block overflow-hidden animate-veda-in",
        compact ? "p-4" : "p-5 sm:p-6",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: meta.color }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {category?.name ?? trend.category}
        </span>
        <VerdictBadge verdict={trend.verdict} size="sm" />
      </div>

      <h3
        className={cn(
          "font-display mt-2 font-semibold leading-tight text-foreground",
          compact ? "text-base" : "text-lg sm:text-xl",
        )}
      >
        {trend.name}
      </h3>

      {!compact && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {trend.summary}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{trend.studyCount} studies</span>
        <span>{trend.confidence} conf.</span>
      </div>
    </Link>
  );
}
