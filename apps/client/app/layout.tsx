import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MapleMono } from "@/style/font";
import "@mdxeditor/editor/style.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumix",
  description: "All in One Brainstorming Platform",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} ${MapleMono.variable} antialiased text-sm`}
      >
        <Toaster position={"top-center"} />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
