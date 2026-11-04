"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUrlState, type UrlParamSchema } from "@/hooks/use-url-state";

/** Popular entry points, not an exhaustive list of what the API can match. */
const POPULAR_SEARCHES = [
  "Hoodie",
  "Denim",
  "Training tee",
  "Outerwear",
  "Joggers",
] as const;

/**
 * Only the params the search box owns. `pageIndex` is reset in the same write
 * as `search`, so a new query can never land on a page that no longer exists.
 */
const SEARCH_URL_SCHEMA = {
  search: { kind: "string", trim: true, default: "" },
  pageIndex: { kind: "number", min: 1, default: 1 },
} as const satisfies UrlParamSchema;

/**
 * Top-of-page search section for `/search`.
 *
 * The URL is the source of truth (`?search=`), so submitting a query is
 * shareable and survives reload. The input keeps a local draft while typing
 * and commits on submit (or a popular-search chip), which is also where the
 * future search API hook will get its query key.
 */
export default function ProductSearchBar() {
  const { state, setParams } = useUrlState(SEARCH_URL_SCHEMA);
  const [draft, setDraft] = useState(state.search);
  const [committedSearch, setCommittedSearch] = useState(state.search);
  const inputRef = useRef<HTMLInputElement>(null);

  // External URL changes (back/forward, a deep link, the Clear link on the
  // results empty state) flow back into the draft. Render-phase adjustment
  // instead of an effect so it never causes a second paint.
  if (state.search !== committedSearch) {
    setCommittedSearch(state.search);
    setDraft(state.search);
  }

  const commit = (value: string) => {
    const next = value.trim();
    setDraft(next);
    setParams({ search: next, pageIndex: 1 });
  };

  const clear = () => {
    setDraft("");
    setParams({ search: "", pageIndex: 1 });
    inputRef.current?.focus();
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-muted/40 via-background to-background">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none text-[11rem] font-black leading-none tracking-tighter text-foreground/3 lg:block"
      >
        KOA
      </span>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 md:px-8 md:pb-12 md:pt-16">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Search the wardrobe
        </p>

        <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Find your next essential.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Performance layers, denim, and everyday staples — built to move with
          you. Search by product, category, or the piece you already have in
          mind.
        </p>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            commit(draft);
          }}
          className="mt-8 max-w-3xl"
        >
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm transition-colors focus-within:border-foreground/30 focus-within:ring-3 focus-within:ring-ring/20 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-2 sm:px-3">
              <Search
                aria-hidden="true"
                className="size-5 shrink-0 text-muted-foreground"
              />

              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>
              <input
                ref={inputRef}
                id="product-search"
                type="search"
                name="search"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Search hoodies, denim, tees…"
                autoComplete="off"
                className="h-12 w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
              />

              {draft && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Clear search"
                  className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 rounded-xl px-6 text-sm font-semibold sm:min-w-28"
            >
              Search
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Popular
            </span>

            {POPULAR_SEARCHES.map((term) => {
              const isActive =
                state.search.toLowerCase() === term.toLowerCase();

              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => commit(term)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  {term}
                </button>
              );
            })}
          </div>
        </form>
      </div>
    </section>
  );
}

/**
 * Static stand-in shown while the URL-reading search form suspends. Mirrors the
 * section's spacing so the results below it do not jump when it hydrates.
 */
export function ProductSearchBarFallback() {
  return (
    <section className="border-b border-border bg-linear-to-b from-muted/40 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 md:px-8 md:pb-12 md:pt-16">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-4 h-12 w-full max-w-xl md:h-14" />
        <Skeleton className="mt-5 h-4 w-full max-w-lg" />
        <Skeleton className="mt-8 h-16 w-full max-w-3xl rounded-2xl" />
      </div>
    </section>
  );
}
