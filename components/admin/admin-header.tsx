import { Show, UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";

export default function AdminHeader() {
  return (
    <header className="h-13 flex items-center justify-between border-b px-4 bg-background">
      <SidebarTrigger />
      <Show when="signed-in">
        <div className="h-10 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-md transition duration-300 flex items-center justify-center">
          <UserButton />
        </div>
      </Show>
    </header>
  )
}