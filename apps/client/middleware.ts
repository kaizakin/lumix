// it runs on every request and update session.
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const nextAuthMiddleware = NextAuth(authConfig);
const middlware: typeof nextAuthMiddleware.auth = nextAuthMiddleware.auth;


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
} // exclude certain paths don't wanna run middlware on every freakin route.

export default middlware;