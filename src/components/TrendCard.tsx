import { Link } from "@tanstack/react-router";
import type { Trend } from "@/data/trends";
import { CATEGORIES } from "@/data/trends";
import { VERDICT_META } from "@/lib/verdict";
import { VerdictBadge } from "./VerdictBadge";
import { cn } from "@/lib/utils";

interface TrendCardProps {
  trend: Trend;
  className?: string;
}

export function TrendCard({ trend, className }: TrendCardProps) {
  const meta = VERDICT_META[trend.verdict];
  const category = CATEGORIES.find((c) => c.slug === trend.category);

  return (
    <Link
      to="/trend/$id"
      params={{ id: trend.id }}
      className={cn(
        "group glass-card glass-card-hover relative block overflow-hidden p-5 sm:p-6 animate-veda-in",
        className,
      )}
      style={{
        // subtle gradient stripe tinted by verdict
        backgroundImage: `linear-gradient(180deg, ${meta.color}10 0%, transparent 40%)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: meta.color }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {category?.name ?? trend.category}
        </span>
        <VerdictBadge verdict={trend.verdict} size="sm" />
      </div>

      <h3 className="font-display mt-3 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
        {trend.name}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {trend.summary}
      </p>

      <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
        <span>{trend.studyCount} studies</span>
        <span className="flex items-center gap-2">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)}
            aria-hidden
          />
          {trend.confidence} conf.
        </span>
      </div>
    </Link>
  );
}
