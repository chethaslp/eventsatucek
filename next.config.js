/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
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
    webpack: (config, { isServer }) => {
        // add copy webpack plugin
        if (isServer) {
          config.plugins.push(
            new (require('copy-webpack-plugin'))({
              patterns: [
                {
                  // copy the templates folder
                  from: 'components/templates/',
                  to: 'components/templates/',
                },
              ],
            }),
          )
        }
        return config
      },
}

module.exports = nextConfig
