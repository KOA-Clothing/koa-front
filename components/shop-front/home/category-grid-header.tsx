import Link from "next/link";

interface CategoryGridHeaderProps {
  /** Small uppercase kicker above the title. */
  eyebrow: string;
  title: string;
  /** Optional link pinned to the right on wide viewports. */
  action?: {
    label: string;
    href: string;
  };
}

/**
 * Heading block for the landing page's category carousel.
 *
 * Kept separate from the grid so the data/carousel logic below stays focused
 * on the tiles, and the copy can change without touching layout code.
 */
export default function CategoryGridHeader({
  eyebrow,
  title,
  action,
}: CategoryGridHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground font-mono">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
      </div>

      {action && (
        <Link
          href={action.href}
          className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
