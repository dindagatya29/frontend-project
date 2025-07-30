/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["localhost", "127.0.0.1"],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://nexapro.web.id/api",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://nexapro.web.id/api",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://nexapro.web.id/api/:path*",
      },
    ]
  },
}

module.exports = nextConfig
