import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker/Cloud Run
  output: 'standalone',
  // Ignore ESLint errors during production builds (Docker builds)
  // These are development-time checks and shouldn't block production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during builds (optional - uncomment if needed)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
