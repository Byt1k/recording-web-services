/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    poweredByHeader: false,
    compress: false,
    output: 'standalone',
    images: {
        dangerouslyAllowSVG: true,
        minimumCacheTTL: 60,
        domains: ['localhost', 'localhost:3000', 'localhost:8000'],
    },
}

module.exports = nextConfig
