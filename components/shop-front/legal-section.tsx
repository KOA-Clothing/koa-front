import type { ReactNode } from "react";

type LegalSectionProps = {
  /** Anchor id for the contents link above the sections. */
  id: string;
  /** 1-based position, rendered zero-padded in the label column. */
  index: number;
  /** Short uppercase label shown beside the section number. */
  label: string;
  /** Section heading. */
  title: string;
  children: ReactNode;
};

/**
 * Long-form content section used by the storefront legal pages
 * (`/privacy-policy`, `/terms-of-service`). Mirrors the About page pattern:
 * sticky eyebrow column on the left, prose on the right.
 */
export function LegalSection({
  id,
  index,
  label,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section id={id} className="border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid gap-6 md:gap-12 md:grid-cols-[1fr_2fr] items-start">
          <div className="flex items-baseline gap-4 md:sticky md:top-24">
            <span className="text-xs font-medium tabular-nums text-primary">
              {String(index).padStart(2, "0")}
            </span>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
              {label}
            </p>
          </div>

          <div className="min-w-0 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold leading-snug tracking-tight text-foreground">
              {title}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
