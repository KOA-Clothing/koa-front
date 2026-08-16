import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/signin',
        permanent: true, // Set to false if it's a temporary redirect (307 vs 308)
      },
    ];
  },
};

export default nextConfig;
