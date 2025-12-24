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
        hostname: "amzn-s3-wincurs.s3.us-east-1.amazonaws.com",
      },
      { hostname: "media4.giphy.com" },
    ],
  },
};

export default nextConfig;
