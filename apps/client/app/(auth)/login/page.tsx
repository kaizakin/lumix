
import { signIn } from "@/auth"

export default function SignIn() {
  return (
    <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center">
      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <button type="submit">Signin with google</button>
      </form>
      <form
        action={async () => {
          "use server"
          await signIn("github")
        }}
      >
        <button type="submit">Signin with github</button>
      </form>
    </div>
  )
} 