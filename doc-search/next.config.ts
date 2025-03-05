import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   // Enable React strict mode
   reactStrictMode: true,

   experimental: {
     serverActions: {
     allowedOrigins: ['localhost:3000']
     },

   },
  
   // Configure base path if app isn't hosted at root
   // basePath: '/docs',
   
   // Configure custom build directory
   distDir: '.next',
   
   // Enable image optimization
   images: {
     domains: ['your-domain.com'],
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
   }
}; 

export default nextConfig;