import { AccountTabs } from "@/components/account/account-tabs";
import BackButton from "@/components/general/back-button";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh w-full bg-background">
      <a
        href="#account-content"
        className="sr-only z-50 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-3 focus:ring-ring/50"
      >
        Skip to account content
      </a>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <BackButton />
          <div className="min-w-0">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
              My account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your profile, addresses, orders, and transactions.
            </p>
          </div>
        </header>

        <AccountTabs />

        <main
          id="account-content"
          tabIndex={-1}
          aria-label="Account content"
          className="min-w-0 outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
