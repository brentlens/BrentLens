import type { NextConfig } from "next";

const nextConfig : NextConfig =  {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
	
    optimizePackageImports: ['lucide-react', 'framer-motion'], 
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Accepts any HTTPS host
      },
      {
        protocol: 'http',
        hostname: '**', // Optional: Accepts any HTTP host (less secure)
      },
    ],
  },
};
export default nextConfig;
