import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@repo/db" // Adjust import based on your monorepo structure
import { authConfig } from "./auth.config"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

const nextAuth = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub; // take the userid from jwttoken and store it in session
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id; // take the userid given from prisma adapter and issue it in jwt
            }
            return token;
        }
    },
    providers: [
        GitHub,
        Google,
    ],
})

export const handlers: typeof nextAuth.handlers = nextAuth.handlers;
export const auth: typeof nextAuth.auth = nextAuth.auth;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const signOut: typeof nextAuth.signOut = nextAuth.signOut;