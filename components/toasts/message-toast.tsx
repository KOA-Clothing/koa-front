"use client";

import { CheckCircle2, X, XCircle, type LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MessageToastVariant = "success" | "error";

interface MessageToastProps {
  variant: MessageToastVariant;
  message: string;
  /**
   * react-hot-toast mounts a `toast.custom` node already visible and only
   * flips `visible` to false on dismissal, keeping the node mounted for
   * `removeDelay` — that flip is what drives the exit animation.
   */
  visible?: boolean;
  /** Dismisses this toast (the caller wires `toast.dismiss(t.id)`). */
  onDismiss: () => void;
}

const variants: Record<
  MessageToastVariant,
  {
    title: string;
    Icon: LucideIcon;
    /** Accent on the dark zinc card; the glyph and title carry the meaning too. */
    iconClassName: string;
    role: "status" | "alert";
  }
> = {
  success: {
    title: "Success",
    Icon: CheckCircle2,
    iconClassName: "bg-emerald-500/15 text-emerald-400",
    role: "status",
  },
  error: {
    title: "Error",
    Icon: XCircle,
    iconClassName: "bg-red-500/15 text-red-400",
    role: "alert",
  },
};

/**
 * General-purpose message card for success/error feedback. Same dark zinc
 * surface and enter/exit keyframes as the cart toasts (DESIGN.md §2.1) so every
 * card in the shared deck reads as one system; only the icon, title and ARIA
 * role differ. Errors are assertive (`alert`), successes polite (`status`).
 *
 * Rendered through `toast.custom`, so it owns its whole surface — the dark
 * `toastOptions.style` meant for plain admin toasts is not applied — and keeps
 * `pointer-events-auto` because the deck container disables pointer events.
 */
function MessageToast({
  variant,
  message,
  visible = true,
  onDismiss,
}: MessageToastProps) {
  const { title, Icon, iconClassName, role } = variants[variant];

  return (
    <div
      role={role}
      className={cn(
        "pointer-events-auto flex w-[min(92vw,22rem)] items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 pr-1.5 text-zinc-100 shadow-2xl",
        visible
          ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-3 duration-300 ease-out motion-reduce:animate-none"
          : "animate-out fade-out-0 zoom-out-95 slide-out-to-top-3 duration-200 ease-in fill-mode-forwards motion-reduce:animate-none motion-reduce:opacity-0"
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          iconClassName
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
        <p className="text-sm font-semibold text-zinc-100">{title}</p>
        <p className="text-sm text-zinc-300">{message}</p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-mt-0.5 -mr-0.5 shrink-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
      >
        <X className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

/** `removeDelay` sits just past the 200 ms exit animation — see add-to-cart-toast.tsx. */
function showMessageToast(variant: MessageToastVariant, message: string) {
  toast.custom(
    (t) => (
      <MessageToast
        variant={variant}
        message={message}
        visible={t.visible}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ),
    { duration: 3500, removeDelay: 250 }
  );
}

/** A generic success message. */
export function showSuccessToast(message: string) {
  showMessageToast("success", message);
}

/** A generic error message. */
export function showErrorToast(message: string) {
  showMessageToast("error", message);
}
