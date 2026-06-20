import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
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
        className={cn(
          "group relative flex w-full max-w-md items-center",
          className,
        )}
      >
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#54e0a8]"
          aria-hidden
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Search a trend or ingredient…"
          className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 font-sans text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-[#54e0a8]/50 focus:bg-white/10"
          aria-label="Search trends"
        />
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("relative w-full max-w-2xl", className)}
    >
      <div className="search-glow rounded-2xl">
        <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl transition-all focus-within:border-[#54e0a8]/60 sm:px-6 sm:py-4">
          <Search
            className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-[#54e0a8] sm:h-6 sm:w-6"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus={autoFocus}
            placeholder="Try 'retinoids', 'creatine', 'rosemary oil'…"
            className="w-full min-w-0 bg-transparent font-sans text-base text-foreground placeholder:text-muted-foreground/70 outline-none sm:text-lg"
            aria-label="Search a wellness trend"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-gradient-to-b from-white to-white/85 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#05060d] shadow-[0_8px_30px_-8px_rgba(255,255,255,0.5)] transition-all hover:translate-y-[-1px] hover:shadow-[0_12px_36px_-8px_rgba(84,224,168,0.5)] sm:px-5 sm:py-2.5"
          >
            Explore
          </button>
        </div>
      </div>
    </form>
  );
}
