import { AccountEmptyState } from "@/components/account/account-empty-state";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { ReceiptText } from "lucide-react";

export default function Transactions() {
  return (
    <div className="flex flex-col gap-6">
      <AccountPageHeader
        title="Transactions"
        description="Review transactions associated with your account."
        icon={<ReceiptText className="size-5" />}
      />
      <AccountEmptyState
        title="No transactions yet"
        description="Account transactions will appear here when they are available."
        icon={<ReceiptText className="size-8" />}
      />
    </div>
  );
}
