interface AccountPageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function AccountPageHeader({
  title,
  description,
  icon,
}: AccountPageHeaderProps) {
  return (
    <header className="flex items-start gap-3 border-b border-border pb-5">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
  );
}
