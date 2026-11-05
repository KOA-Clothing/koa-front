import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  href: string;
  title: string;
  subtitle?: string | null;
  /** Optional chip shown beside the arrow, e.g. a grouping label. */
  tag?: string;
  className?: string;
}

/**
 * One category tile on the shop-front landing page.
 *
 * Presentational only — the grid builds the `href` and supplies the category
 * copy. The hover accent bar and arrow are driven by the parent `group`, so
 * the whole tile stays a single interactive link.
 */
export default function CategoryCard({
  href,
  title,
  subtitle,
  tag,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:border-foreground/30 hover:shadow-md md:rounded-2xl md:p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {tag && (
          <span className="hidden rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-flex">
            {tag}
          </span>
        )}
        <div className="ml-auto flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-foreground group-hover:text-background md:size-8">
          <ArrowUpRight className="size-3.5 md:size-4" />
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <h3 className="line-clamp-2 text-sm font-bold tracking-tight text-foreground underline-offset-4 group-hover:underline md:text-lg">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1.5 line-clamp-2 text-[0.7rem] leading-relaxed text-muted-foreground md:text-xs">
            {subtitle}
          </p>
        )}
      </div>

      {/* Subtle hover accent bar */}
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}
