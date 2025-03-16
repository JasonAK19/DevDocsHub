import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   // Enable React strict mode
   reactStrictMode: true,
   assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://dev-docs-hub.vercel.app' 
    : undefined,
    

   experimental: {
     serverActions: {
     allowedOrigins: ['localhost:3000',
      'dev-docs-hub.vercel.app',
      '*.vercel.app'
     ]
     },

     clientRouterFilter: true

   },
  
   // Configure base path if app isn't hosted at root
   // basePath: '/docs',
   
   // Configure custom build directory
   distDir: '.next',
   
   // Enable image optimization
   images: {
     domains: ['your-domain.com'],
   },

   transpilePackages: ['next-auth'],
   
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