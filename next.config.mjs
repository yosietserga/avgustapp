/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["formidable"],
  },
  webpack: (config) => {
    config.externals = [...config.externals, "formidable"];
    return config;
  },
};

export default nextConfig;
