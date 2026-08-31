import { AccountTabs } from "@/components/account/account-tabs";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-heading font-medium">My Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your profile, addresses and more.</p>
          </div>

          <AccountTabs />

          <main className="flex-1 border rounded-xl p-6 bg-background shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
