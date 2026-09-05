import { redirect } from "next/navigation";

export default function DefualtToProfile() {
  return (
    redirect("/account/profile")
  )
}