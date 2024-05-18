/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
    resolve: {
        alias: {
            'express-handlebars': 'handlebars/dist/handlebars.js'
        }
     },
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
                port: '',
              },
        ],
        domains: [
            'localhost',
            '*.googleusercontent.com',
            'drive.google.com',
            'avatars.githubusercontent.com'
    ]},
    reactStrictMode:false,
    webpack5: true,
    webpack: (config) => {
        
      config.resolve.fallback = { fs: false };
  
      return config;
    },
}

module.exports = nextConfig
