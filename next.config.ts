import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com"], // Add allowed image domains here
  },
};

export default nextConfig;
