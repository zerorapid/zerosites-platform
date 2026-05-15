import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enables static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side features that don't work on static hosting
  trailingSlash: true,
};

export default nextConfig;
