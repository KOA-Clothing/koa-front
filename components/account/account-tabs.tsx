"use client"

import { usePathname, useRouter } from "next/navigation"
import { User, ShoppingBag, ReceiptText } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  { value: "profile", label: "Profile", href: "/account/profile", icon: User },
  { value: "orders", label: "Order History", href: "/account/order-history", icon: ShoppingBag },
  { value: "transactions", label: "Transactions", href: "/account/transactions", icon: ReceiptText },
]

export function AccountTabs() {
  const pathname = usePathname()
  const router = useRouter()

  const current = tabs.find((tab) => pathname.startsWith(tab.href))?.value

  return (
    <Tabs
      value={current}
      onValueChange={(value) => {
        const tab = tabs.find((t) => t.value === value)
        if (tab) router.push(tab.href)
      }}
    >
      <TabsList variant="line" className="w-full h-auto justify-start gap-6 border-b border-border pb-px">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="gap-2 h-10 px-1 flex-1 sm:flex-none">
            <tab.icon className="size-4" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
