import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker/Cloud Run
  output: 'standalone',
};

export default nextConfig;
