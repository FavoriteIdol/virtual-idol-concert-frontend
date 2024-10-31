import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nextui.org", "via.placeholder.com", "example.com"],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
