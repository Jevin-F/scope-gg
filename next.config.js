/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/scope-gg',
  assetPrefix: '/scope-gg',
  trailingSlash: true,
}

module.exports = nextConfig
