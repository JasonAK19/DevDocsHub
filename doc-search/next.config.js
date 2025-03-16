/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode
    reactStrictMode: true,
    
    assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://dev-docs-hub.vercel.app' 
    : undefined,
  
    // Experimental features configuration
    experimental: {
      serverActions: {
        // Allow your production domain when deployed
        allowedOrigins: ['localhost:3000', 'dev-docs-hub.vercel.app', '*.vercel.app']
      },
      clientRouterFilter: true
    },
    
    // Configure custom build directory
    distDir: '.next',
    
    // Enable image optimization
    images: {
      // Add your actual domain(s) here
      domains: ['dev-docs-hub.vercel.app', 'vercel.app'],
    },
    
    // Configure rewrites for API routes
    async rewrites() {
      return [
        // Forward API requests to your Express backend
        {
          source: '/api/users/:path*',
          destination: '/api/users/:path*',
        },
        {
          source: '/api/search/:path*',
          destination: '/api/search/:path*',
        }
      ]
    }
  };
  
  module.exports = nextConfig;