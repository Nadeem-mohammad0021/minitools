import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['muhammara', 'docx', 'pdfjs-dist', 'sharp', 'sitemap', 'nanoid', 're2'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('aws-sdk', 'mock-aws-s3', 'nock');
    }
    return config;
  },
};

export default nextConfig;
