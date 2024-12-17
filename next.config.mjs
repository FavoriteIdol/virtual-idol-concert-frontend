import createNextIntlPlugin from "next-intl/plugin";
import { resolve } from 'path';
import withPWA from '@ducanh2912/next-pwa';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "nextui.org" },
      { hostname: "via.placeholder.com" },
      { hostname: "example.com" },
      { hostname: "master-of-prediction.shop" },
      { hostname: "file.reward-factory.shop" },
      { hostname: "localhost" },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        __dirname: resolve('./'),
      };
    }
    return config;
  }
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(withNextIntl(nextConfig));
