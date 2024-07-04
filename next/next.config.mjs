/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['markdown-latex-renderer'],
};

export default nextConfig;
