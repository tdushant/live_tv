import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['tv.khabriya.in','dashboard.khabriya.in','https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
};

export default nextConfig;
