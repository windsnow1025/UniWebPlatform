import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  transpilePackages: [
    'markdown-latex-renderer',
  ],
  productionBrowserSourceMaps: true,
};

export default nextConfig;
