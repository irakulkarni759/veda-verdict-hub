import type { Verdict } from "@/data/trends";
import { VERDICT_META } from "@/lib/verdict";
import { cn } from "@/lib/utils";

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VerdictBadge({ verdict, size = "md", className }: VerdictBadgeProps) {
  const meta = VERDICT_META[verdict];
  const sizes = {
    sm: "text-[10px] px-2 py-1 gap-1.5",
    md: "text-xs px-3 py-1.5 gap-2",
    lg: "text-sm px-4 py-2 gap-2.5",
  };
  const dotSize = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-mono uppercase tracking-[0.14em] font-medium whitespace-nowrap",
        meta.badgeClass,
        sizes[size],
        className,
      )}
    >
      <span className={cn("rounded-full animate-veda-pulse", meta.dotClass, dotSize[size])} />
      {meta.label}
    </span>
  );
}
