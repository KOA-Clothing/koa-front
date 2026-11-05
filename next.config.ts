import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "br-morning-shape-b3byr7qe.storage.c-4.ap-southeast-1.aws.neon.tech",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "br-falling-cell-b3sykhid.storage.c-4.ap-southeast-1.aws.neon.tech",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/signin',
        permanent: false, // Set to false if it's a temporary redirect (307 vs 308)
      },
      {
        source: '/search',
        destination: '/products/search',
        permanent: false, // Set to false if it's a temporary redirect (307 vs 308)
      },
      // {
      //   source: '/admin',
      //   destination: '/admin/analytics',
      //   permanent: false, // Set to false if it's a temporary redirect (307 vs 308)
      // },
    ];
  },
};

export default nextConfig;
