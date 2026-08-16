import { SignupForm } from "@/components/forms/sign-up-form"
import Image from "next/image"
import logo from "@/public/logo/black/warrior-face.png"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-20 items-center justify-center">
            <Image src={logo} alt={"Koa Warrior Face"} />
          </div>
        </Link>
        <SignupForm />
      </div>
    </div>
  )
}
