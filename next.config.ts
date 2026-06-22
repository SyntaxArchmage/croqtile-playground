import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ["10.0.16.52"],
};

export default nextConfig;
