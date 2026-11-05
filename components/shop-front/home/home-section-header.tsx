interface HomeSectionHeaderProps {
  /** Small uppercase kicker above the title. */
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * Shared heading block for the landing page's product showcases.
 *
 * Layout only: the featured and discounted sections differ by copy, not by
 * structure, so the eyebrow/title/description rhythm lives here instead of
 * being copied into every section.
 */
export default function HomeSectionHeader({
  eyebrow,
  title,
  description,
}: HomeSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-primary" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground font-mono">
            {eyebrow}
          </p>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
