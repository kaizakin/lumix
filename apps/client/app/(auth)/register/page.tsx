
import { signIn } from "@/auth"
import Link from "next/link"
import { GoogleIcon } from "@/components/ui/google-icon"
import GithubIcon from "@/components/ui/github-icon"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function SignIn() {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            <div className="flex flex-col justify-between px-8 py-12 md:px-12 lg:px-16 xl:px-24 bg-neutral-100">
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-black transition-colors mb-12 hover:bg-neutral-300 px-4 py-2 rounded-lg bg-white/50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>

                    <div className="mb-8">
                        <div className="h-10 w-10 bg-teal-500 rounded-sm flex items-center justify-center text-white font-bold text-xl mb-6">
                            <Image src={"/lumixlogo.png"} alt="L" width={"30"} height={"30"}></Image>
                        </div>
                        <h1 className="text-3xl text-black font-bold tracking-tight mb-2">Create your account</h1>
                        <p className="text-muted-foreground">Signup to get started with Lumix</p>
                    </div>

                    <div className="space-y-4">
                        <form
                            action={async () => {
                                "use server"
                                await signIn("github")
                            }}
                            className="w-full"
                        >
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-800"
                            >
                                <GithubIcon className="h-5 w-5 fill-white" />
                                <span className="font-medium">Continue with GitHub</span>
                            </button>
                        </form>

                        <form
                            action={async () => {
                                "use server"
                                await signIn("google")
                            }}
                            className="w-full"
                        >
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-800"
                            >
                                <div className="p-0.5 bg-white rounded-full">
                                    <GoogleIcon className="h-4 w-4" />
                                </div>
                                <span className="font-medium">Continue with Google</span>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 text-center text-xs text-neutral-500">
                    <p>
                        Already have an account?{" "}
                        <Link href="/login" className="text-teal-500 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-2 text-neutral-500">
                        <span>Lumix</span>
                        <span>•</span>
                        <span>All rights reserved.</span>
                    </div>
                </div>
            </div>

            <div className="md:flex flex-col justify-end relative bg-[#2a2d31] overflow-hidden p-12">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80 z-10" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] border-2 border-teal-500/50 shadow-[0_0_100px_rgba(249,115,22,0.3)] z-0 rounded-sm" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] bg-linear-to-b from-teal-500/10 to-transparent z-0 blur-xl" />

                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.35)_0%,rgba(0,0,0,1)_70%)]" />

                <div className="relative z-20 max-w-lg">
                    <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-xs font-medium text-white/80 mb-4 border border-white/10">
                        Lumix Community
                    </div>
                    <h2 className="text-3xl text-pretty font-serif text-white/90 mb-2">
                        Build the Things, That You <span className="italic">Wish</span> Existed
                    </h2>
                    <p className="text-white/50 text-sm">
                        Where passionate builders create the future
                    </p>
                </div>
            </div>
        </div>
    )
}