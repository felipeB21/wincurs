import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "dh0xanzpb2e1h.cloudfront.net",
      },
      { hostname: "media4.giphy.com" },
    ],
  },
};

export default nextConfig;
