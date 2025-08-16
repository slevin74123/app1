import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Exclude magicpath-project-2 from the build
      'magicpath-project-2': false,
    };
    return config;
  },
};

export default nextConfig;
