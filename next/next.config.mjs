/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['markdown-latex-renderer'],
  productionBrowserSourceMaps: true,
};

export default nextConfig;
