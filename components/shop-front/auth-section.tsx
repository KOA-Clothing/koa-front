import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

interface Props {
  isSolidActive : boolean
}

export default function AuthSection({isSolidActive} : Props) {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton>
          <button 
            // Added 'border' to the base classes so the width is always present
            className={`border rounded-full font-medium text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-4 cursor-pointer transition duration-300 ${
              isSolidActive 
                ? 'text-foreground hover:bg-muted border-neutral-500' 
                // Added 'border-transparent' to the inactive state
                : 'text-white border-transparent hover:bg-white/10'
            }`}
          >
            Sign In
          </button>
        </SignInButton>

        <SignUpButton>
          <button 
            className={`border border-transparent rounded-full font-medium text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-4 cursor-pointer transition duration-300 ${
              isSolidActive 
                ? 'bg-foreground text-background hover:bg-foreground/90' 
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            Sign Up
          </button>
        </SignUpButton>
      </Show>

      <Show when="signed-in">
        <div className={`p-1 rounded-full transition duration-300 ${isSolidActive ? 'hover:bg-muted' : 'hover:bg-white/10'}`}>
          <UserButton />
        </div>
      </Show>
    </div>
  )
}