/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode
    reactStrictMode: true,
  
    // Experimental features configuration
    experimental: {
      serverActions: {
        // Allow your production domain when deployed
        allowedOrigins: process.env.NODE_ENV === 'production' 
          ? [process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '') || 'dev-docs-hub.vercel.app'] 
          : ['localhost:3000']
      }
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