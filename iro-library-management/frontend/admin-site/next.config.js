/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
  },
}

module.exports = nextConfig
