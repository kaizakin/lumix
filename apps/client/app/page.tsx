import GithubButton from "@/components/GithubButton";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Home() {

  return (
    <div className="relative min-h-screen bg-[#faf7f3] text-neutral-900 overflow-x-hidden selection:bg-[#ADEED9]">
      <Navbar />
      <div className="mx-auto max-w-[1400px] relative min-h-screen bg-[#faf7f3] shadow-sm ring-1 ring-black/5">

        <div
          className="absolute top-0 bottom-0 left-0 w-3 md:w-4 z-20
            border-r border-neutral-200/60
            bg-[image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.16)_5px,rgba(0,0,0,0.16)_6px)]
          "
        />

        <div
          className="absolute top-0 bottom-0 right-0 w-3 md:w-4 z-20
            border-l border-neutral-200/60
            bg-[image:repeating-linear-gradient(-45deg,transparent,transparent_5px,rgba(0,0,0,0.16)_5px,rgba(0,0,0,0.16)_6px)]
          "
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col min-h-screen">

          <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 w-full max-w-[1200px] mx-auto">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">

              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:bg-white/80">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                  v1.0 is now live
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.1]">
                  Thoughts, <br className="hidden md:block" />
                  <span className="text-neutral-500">structured beautifully.</span>
                </h1>

                <p className="max-w-[42rem] text-lg leading-normal text-neutral-600 sm:text-xl sm:leading-8 pt-4">
                  Lumix gives you a calm, distraction-free environment to capture, organize, and refine your best ideas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/dashboard" className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-neutral-900 shadow hover:bg-teal-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 transition-all active:scale-95">
                  Get Started Free
                </Link>
                <GithubButton />
              </div>

              <div className="pt-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">Trusted by thinkers at</p>
              </div>

            </div>
          </main>

          <footer className="py-8 text-center text-sm text-neutral-400 relative z-20">
            <p>© {new Date().getFullYear()} Lumix. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
