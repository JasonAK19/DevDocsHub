/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  transpilePackages: ['undici', '@elastic/elasticsearch', '@elastic/transport'],

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'devdocshub.vercel.app']
    },
  },
 
  // Configure base path if app isn't hosted at root
  // basePath: '/docs',
  
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

  // Add this to avoid webpack issues with ES modules
  webpack: (config) => {
    // Mark certain packages to be handled via client-side
    config.externals = [...(config.externals || []), "@elastic/elasticsearch"];
    return config;
  }
}; 

module.exports = nextConfig;