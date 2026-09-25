import { Badge } from "@/components/ui/badge";

interface KoaBoolBadgeProps {
  active: boolean;
  label: string;
}

export default function KoaBoolBadge({ active, label }: KoaBoolBadgeProps) {
  return active ? (
    <Badge className="bg-success/10 text-success">{label}</Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      {label}
    </Badge>
  );
}