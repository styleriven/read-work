import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactMaxHeadersLength: 1000,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "truyenhdt.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },

  allowedDevOrigins: [
    "https://concordantly-unexudative-thomasena.ngrok-free.app",
    // Có thể thêm localhost nếu cần
    "http://localhost:3000",
  ],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
