/** @type {import('next').NextConfig} */
const nextConfig = {
  // Universal deployment settings
  output: 'standalone',
  trailingSlash: false,
  
  // Universal headers for any environment
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Referer, User-Agent' },
          { key: 'Access-Control-Allow-Credentials', value: 'false' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' }, // Allow embedding anywhere
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
        ],
      },
    ]
  },

  // Universal image settings
  images: {
    unoptimized: true, // Works everywhere
    domains: ['*'], // Allow any domain
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Disable features that might cause issues in embedded environments
  poweredByHeader: false,
  compress: true,
  
  // Universal build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental features for better compatibility
  experimental: {
    serverComponentsExternalPackages: [],
    esmExternals: 'loose',
  },

  // Webpack config for universal compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

export default nextConfig
