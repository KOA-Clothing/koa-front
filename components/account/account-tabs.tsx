"use client";

import { ReceiptText, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { label: "Profile", href: "/account/profile", icon: User },
  {
    label: "Order History",
    href: "/account/order-history",
    icon: ShoppingBag,
  },
  {
    label: "Transactions",
    href: "/account/transactions",
    icon: ReceiptText,
  },
];

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account sections" className="overflow-x-auto">
      <ul className="flex min-w-max items-center gap-6 border-b border-border">
        {tabs.map((tab) => {
          const isActive = isRouteActive(pathname, tab.href);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className="size-4" aria-hidden="true" />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
