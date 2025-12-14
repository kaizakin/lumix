import type { NextConfig } from "next";
// Even though @repo/db exports pre-transpiled JavaScript,
// Next.js still needs to transpile it so it can analyze the module properly. 
// In a monorepo (especially with pnpm symlinks), Next treats shared packages as external dependencies and skips them, 
// which breaks ESM/CJS handling, server-only code (like Prisma), and edge/server boundaries. 
// transpilePackages forces Next.js to include the package in its compilation graph so it can safely reason about imports and runtime behavior
const nextConfig: NextConfig = {
  transpilePackages: ["@repo/db"], // askinig next.js to custom transpile this user written package.
  images: {
    domains: ["i.pravatar.cc", "media.tenor.com", "lh3.googleusercontent.com"],
  }
};

export default nextConfig;
