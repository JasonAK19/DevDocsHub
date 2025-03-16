/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode
    reactStrictMode: true,
    
    // Remove assetPrefix if you had it - it can cause issues when incorrectly configured
    
    experimental: {
      serverActions: {
        allowedOrigins: ['localhost:3000', 'dev-docs-hub.vercel.app', '*.vercel.app']
      },
      clientRouterFilter: true
    },
    
    // Configure custom build directory
    distDir: '.next',
    
    // Enable image optimization
    images: {
      domains: ['dev-docs-hub.vercel.app', 'vercel.app'],
      unoptimized: true 
    },
    
    // Simplify rewrites - they should match exactly what you need
    async rewrites() {
      return [];  // Remove rewrites that aren't needed or point to same location
    }
  };
  
  module.exports = nextConfig;