/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/reader',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
