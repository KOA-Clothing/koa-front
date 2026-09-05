import { AccountTabs } from "@/components/account/account-tabs";
import BackButton from "@/components/general/back-button";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-start gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl font-heading font-medium">My Account</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your profile, addresses and more.</p>
            </div>
          </div>

          <AccountTabs />

          <main className="flex-1 border rounded-xl p-4 bg-background shadow-sm max-w-7xl w-7xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
