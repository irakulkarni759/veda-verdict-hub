import { Link } from "@tanstack/react-router";
import { SearchBar } from "./SearchBar";

interface TopNavProps {
  showSearch?: boolean;
}

export function TopNav({ showSearch = true }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#05060d]/70 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          to="/"
          className="group flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-[#54e0a8] shadow-[0_0_14px_2px_rgba(84,224,168,0.6)] transition-transform group-hover:scale-125"
          />
          <span className="italic">veda</span>
        </Link>

        <div className="hidden min-w-0 justify-center md:flex">
          {showSearch ? <SearchBar size="compact" /> : null}
        </div>

        <nav className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            to="/category/$slug"
            params={{ slug: "skincare" }}
            className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Browse
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-[#54e0a8]/40 hover:text-foreground sm:text-[11px]"
          >
            Home
          </Link>
        </nav>
      </div>

      {/* Mobile search row */}
      {showSearch ? (
        <div className="border-t border-white/5 px-4 py-2.5 md:hidden">
          <SearchBar size="compact" className="max-w-none" />
        </div>
      ) : null}
    </header>
  );
}
