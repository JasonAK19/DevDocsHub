/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: ['undici', '@elastic/elasticsearch', '@elastic/transport'],

  experimental: {
    // Proper configuration for Server Actions
    serverActions: {
      allowedOrigins: ['localhost:3000', 'devdocshub.vercel.app']
    },
    // Add proper Turbo configuration
    turbo: {
      resolveAlias: {
        // Ensure @elastic/elasticsearch is properly handled in both modes
        "@elastic/elasticsearch": "@elastic/elasticsearch"
      },
      // Ensure external packages are properly handled
      rules: {
        // Add any specific rules for problematic modules
      }
    }
  },
 
  // Configure custom build directory
  distDir: '.next',
  
  // Enable image optimization
  images: {
    domains: ['devdocshub.vercel.app'],
  },
  
  // Configure environment variables
  env: {
    customKey: 'value'
  },
  
  // Configure rewrites/redirects if needed
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: '/api/:path*',
    }]
  },

  // Webpack configuration for production builds
  webpack: (config, { isServer, dev }) => {
    // Mark certain packages to be handled via client-side
    config.externals = [...(config.externals || []), "@elastic/elasticsearch"];
    
    // Improve compatibility with problematic packages
    if (!isServer && !dev) {
      // Only apply to client-side production builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  }
}; 

module.exports = nextConfig;