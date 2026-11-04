"use client";

interface CategoryNameProps {
  name: string;
}

export default function CategoryName({ name }: CategoryNameProps) {
  return (
    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
      {name}
    </p>
  );
}
