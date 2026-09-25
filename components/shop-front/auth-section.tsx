import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

import UserButton from "@/components/account/user-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthSectionProps {
  showSignUp?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function AuthSection({
  showSignUp = true,
  fullWidth = false,
  className,
}: AuthSectionProps) {
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        fullWidth && "flex-col items-stretch",
        className,
      )}
    >
      <Show when="signed-out">
        <SignInButton>
          <button
            type="button"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: cn(
                "min-h-11 cursor-pointer rounded-control border-hairline bg-surface px-4 text-ink-strong hover:bg-cloud",
                widthClass,
              ),
            })}
          >
            Sign in
          </button>
        </SignInButton>

        {showSignUp ? (
          <SignUpButton>
            <button
              type="button"
              className={buttonVariants({
                variant: "storefront",
                size: "storefront",
                className: cn("cursor-pointer rounded-control", widthClass),
              })}
            >
              Sign up
            </button>
          </SignUpButton>
        ) : null}
      </Show>

      <Show when="signed-in">
        <div className="flex min-h-11 min-w-11 items-center justify-center [&>button:first-child]:size-11">
          <UserButton />
        </div>
      </Show>
    </div>
  );
}
