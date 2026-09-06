import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wbxgnqhbviitliopxnac.supabase.co',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
