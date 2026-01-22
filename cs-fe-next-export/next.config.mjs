/** @type {import('next').NextConfig} */

import path from 'path';

const nextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log('apiUrl', apiUrl);
    return [
      {
        source: '/v1/:path*',
        destination: `${apiUrl}/v1/:path*`,
      },
    ];
  },
  reactStrictMode: false,
  env: {
    CUSTOM_ENV: process.env.NEXT_PUBLIC_ENV || 'development',
    CUSTOM_API_PRINT_LOG: process.env.NEXT_PUBLIC_API_PRINT_LOG || 'true',
    CUSTOM_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
    CUSTOM_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    CUSTOM_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      if (config.mode === 'development') {
        config.devtool = 'source-map';
        config.optimization.minimize = false;
      }

      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve('src'),
      '@public': path.resolve('public'),
    };
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|m4a)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
