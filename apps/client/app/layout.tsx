import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import "@milkdown/theme-nord/style.css";
import { MapleMono } from "@/style/font";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner"



const geist = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumix",
  description: "All in One Brainstorming Platform",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.className} ${MapleMono.variable} antialiased text-sm`}
      >
        <Toaster position={"top-center"} />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
