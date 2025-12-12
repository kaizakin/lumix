import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/db"], // askinig next.js to custom transpile this user written package.
};

export default nextConfig;
