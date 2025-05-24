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
  optimizeFonts: true,
  // Add font optimization settings
  fontOptimization: {
    preload: true,
    inlineDataURLLimit: 8192,
    domains: ['fonts.gstatic.com']
  }
}

module.exports = nextConfig
