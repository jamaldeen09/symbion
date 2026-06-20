import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Show when="signed-out">
        <SignUpButton mode="redirect">
          <Button size="lg">Sign Up</Button>
        </SignUpButton>
      </Show>

      <Show when="signed-out">
        <SignInButton mode="redirect">
          <Button size="lg">Sign In</Button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <Button asChild>
          <Link href="/surface/dih">Surface page</Link>
        </Button>
      </Show>
    </div>
  )
}