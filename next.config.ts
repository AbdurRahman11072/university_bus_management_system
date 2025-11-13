import { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Disable ESLint during production builds per user request
  // (this prevents ESLint rules from failing the build)
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
