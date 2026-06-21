import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  size?: "hero" | "compact";
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  size = "hero",
  initialQuery = "",
  autoFocus,
  className,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQuery);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate({ to: "/search", search: { q: query } });
  };

  if (size === "compact") {
    return (
      <form
        onSubmit={onSubmit}
        className={cn("group relative flex w-full max-w-md items-center", className)}
      >
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
          aria-hidden
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Search a trend…"
          className="w-full rounded-full border border-ink/15 bg-white py-2 pl-9 pr-4 font-sans text-sm text-foreground outline-none transition-all focus:border-ink"
          aria-label="Search trends"
        />
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative w-full", className)}>
      <div className="group flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-4 py-3 transition-all focus-within:shadow-[6px_6px_0_0_rgba(13,13,13,1)] sm:px-5 sm:py-4">
        <Search className="h-5 w-5 shrink-0 text-ink" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Try 'retinoids', 'creatine', 'rosemary oil'…"
          className="w-full min-w-0 bg-transparent font-sans text-base text-foreground placeholder:text-muted-foreground outline-none sm:text-lg"
          aria-label="Search a wellness trend"
        />
        <button
          type="submit"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-transform hover:translate-x-0.5 sm:px-4"
        >
          Verify
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </form>
  );
}
