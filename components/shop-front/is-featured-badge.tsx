"use client";

import { Badge } from "@/components/ui/badge";

interface IsFeaturedBadgeProps {
  isFeatured: boolean;
}

export default function IsFeaturedBadge({ isFeatured }: IsFeaturedBadgeProps) {
  if (!isFeatured) return null;
  return <Badge className="bg-foreground text-background">Featured</Badge>;
}
