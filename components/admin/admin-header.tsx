import { SidebarTrigger } from "../ui/sidebar";

export default function AdminHeader() {
  return (
    <header className="h-14 flex items-center border-b px-4 bg-background">
      <SidebarTrigger />
    </header>
  )
}