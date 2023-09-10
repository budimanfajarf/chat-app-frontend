/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'budi.day',
        port: '',
        pathname: '/pictures/**',
      },
    ],
  },
};

module.exports = nextConfig;
