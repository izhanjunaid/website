const { API_CONFIG } = require('./config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        encoding: false,
      };
    }
    return config;
  },
  images: {
    domains: API_CONFIG.IMAGE_DOMAINS,
  },
}

module.exports = nextConfig
