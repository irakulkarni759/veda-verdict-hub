import { Link } from "@tanstack/react-router";
import { SearchBar } from "./SearchBar";

interface TopNavProps {
  showSearch?: boolean;
}

export function TopNav({ showSearch = true }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          to="/"
          className="group flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-ink" />
          <span>veda</span>
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
            className="rounded-full border border-ink/20 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition-all hover:bg-ink hover:text-paper sm:text-[11px]"
          >
            Home
          </Link>
        </nav>
      </div>

      {showSearch ? (
        <div className="border-t border-ink/10 px-4 py-2.5 md:hidden">
          <SearchBar size="compact" className="max-w-none" />
        </div>
      ) : null}
    </header>
  );
}
