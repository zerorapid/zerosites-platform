import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enables static export for GitHub Pages
  basePath: '/zerosites-platform', // Required for GitHub Pages project repos
  assetPrefix: '/zerosites-platform/', // Required for GitHub Pages project repos
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
};

export default nextConfig;
