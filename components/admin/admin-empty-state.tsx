interface AdminEmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function AdminEmptyState({
  title,
  description,
  icon,
}: AdminEmptyStateProps) {
  return (
    <section className="flex min-h-60 min-w-0 flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-10 text-center">
      <div
        className="flex size-10 items-center justify-center text-muted-foreground"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </section>
  );
}
