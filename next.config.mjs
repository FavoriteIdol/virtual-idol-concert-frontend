import createNextIntlPlugin from "next-intl/plugin";
import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "nextui.org",
      "via.placeholder.com",
      "example.com",
      "master-of-prediction.shop",
      "file.reward-factory.shop",
      "localhost",
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
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
