/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@mui/x-data-grid',
    '@mui/x-data-grid-pro',
    '@mui/x-data-grid-premium',
    'markdown-latex-renderer',
    'markdown-latex-renderer',
  ],
  productionBrowserSourceMaps: true,
};

export default nextConfig;
