import Image from "next/image";
import { DotsRing } from "../dots-ring";

export default function LoadingAnimation() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-50 w-full flex-col items-center justify-center gap-3 text-muted-foreground select-none"
    >
      <DotsRing className="size-12 text-muted-foreground" />
      <span className="text-sm font-medium tracking-wide">Loading...</span>
    </div>
  );
}