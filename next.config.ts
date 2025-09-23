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

  allowedDevOrigins: ["http://localhost:3000"],
};

export default nextConfig;
