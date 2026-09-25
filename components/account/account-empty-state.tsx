import { cn } from "@/lib/utils";

interface AccountEmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AccountEmptyState({
  title,
  description,
  icon,
  children,
  className,
}: AccountEmptyStateProps) {
  return (
    <section
      className={cn(
        "flex min-h-44 min-w-0 flex-col items-center justify-center rounded-xl border border-border bg-background px-6 py-10 text-center",
        className,
      )}
    >
      <div
        className="flex size-10 items-center justify-center text-muted-foreground"
        aria-hidden="true"
      >
        {icon}
      </div>
      <p className="mt-4 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}
