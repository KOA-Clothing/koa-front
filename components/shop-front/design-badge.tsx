"use client";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { DesignDto } from "@/types/design";

interface DesignBadgeProps {
  design: DesignDto;
}

export default function DesignBadge({ design }: DesignBadgeProps) {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Badge variant="outline" className="cursor-default">
            {design.name}
          </Badge>
        }
      />
      {design.description && (
        <HoverCardContent className="w-64">
          <p className="text-sm text-muted-foreground">{design.description}</p>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}
