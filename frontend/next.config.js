/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'akamai',
    path: '',
  },
  future: {
    webpack5: true,
  },
  webpack: (config, {}) => {
      config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
        };
      return config
  },
  trailingSlash: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  }
}

module.exports = nextConfig
