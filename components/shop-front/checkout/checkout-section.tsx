import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CheckoutSectionProps {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * One numbered step on the checkout page. The card, step badge, and heading
 * rhythm are shared so the address and payment steps can never drift apart.
 */
export default function CheckoutSection({
  step,
  title,
  description,
  children,
  className,
}: CheckoutSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold tabular-nums text-background">
          {step}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
