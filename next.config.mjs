/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cdn.shopify.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      }
    ]
  }
};

export default nextConfig;
