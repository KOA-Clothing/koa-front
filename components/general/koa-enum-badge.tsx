import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export default function KoaEnumBadge({ children }: { children: ReactNode }) {
  return <Badge variant="secondary">{children}</Badge>;
}