import { TimerReset } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/admin/page-header";

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Logs"
        description="Review administrative and system activity."
        icon={<TimerReset />}
      />
      <AdminEmptyState
        title="No logs to display"
        description="System activity will appear here when logging is available."
        icon={<TimerReset className="size-5" />}
      />
    </div>
  );
}
