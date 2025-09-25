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

  allowedDevOrigins: ["192.168.50.108", "127.0.0.1", "localhost"],
};

export default nextConfig;
