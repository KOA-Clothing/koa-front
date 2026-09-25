import { AccountEmptyState } from "@/components/account/account-empty-state";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { ShoppingBag } from "lucide-react";

export default function OrderHistory() {
  return (
    <div className="flex flex-col gap-6">
      <AccountPageHeader
        title="Order history"
        description="Review the orders associated with your account."
        icon={<ShoppingBag className="size-5" />}
      />
      <AccountEmptyState
        title="No orders yet"
        description="Orders placed with your account will appear here."
        icon={<ShoppingBag className="size-8" />}
      />
    </div>
  );
}
